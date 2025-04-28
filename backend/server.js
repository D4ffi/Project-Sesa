const express = require('express');
const multer = require('multer');
const AWS = require('aws-sdk');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuración de AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Configuración de Multer para el almacenamiento temporal
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir);
        }
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Configuración de Multer con límites de tamaño
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024, // Límite de 5MB por archivo
        files: 10                  // Máximo 10 archivos a la vez
    },
    fileFilter: (req, file, cb) => {
        // Validar tipos de archivo (solo imágenes)
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Solo se permiten archivos de imagen'), false);
        }
    }
});

// Ruta para subir imágenes a S3
app.post('/api/upload', upload.array('images', 10), async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ error: 'Se requiere el ID del producto' });
        }

        const uploadResults = [];
        const productDir = `products/${productId}`;

        // Procesar cada archivo
        for (const file of req.files) {
            const fileContent = fs.readFileSync(file.path);
            const fileName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
            const s3Path = `${productDir}/${fileName}`;

            // Parámetros para S3
            const params = {
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: s3Path,
                Body: fileContent,
                ContentType: file.mimetype
            };

            // Subir a S3 con manejo de reintentos
            const s3Result = await uploadWithRetry(params);

            // Agregar resultado
            uploadResults.push({
                originalName: file.originalname,
                fileName: fileName,
                s3Url: s3Result.Location,
                path: s3Path
            });

            // Eliminar archivo temporal
            fs.unlinkSync(file.path);
        }

        res.status(200).json({
            success: true,
            message: 'Imágenes subidas correctamente',
            files: uploadResults
        });
    } catch (error) {
        console.error('Error al subir imágenes:', error);

        // Limpiar archivos temporales en caso de error
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                if (fs.existsSync(file.path)) {
                    fs.unlinkSync(file.path);
                }
            });
        }

        res.status(500).json({
            success: false,
            message: 'Error al subir imágenes',
            error: error.message
        });
    }
});

// Función para subir a S3 con reintentos
async function uploadWithRetry(params, maxRetries = 3) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await s3.upload(params).promise();
        } catch (error) {
            attempt++;
            console.error(`Error en intento ${attempt} de ${maxRetries}:`, error);
            if (attempt === maxRetries) throw error;
            // Esperar tiempo exponencial entre reintentos
            await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
        }
    }
}

// Middleware para manejar errores de multer antes del manejador general
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'El archivo es demasiado grande. El tamaño máximo es 5MB.'
            });
        }
        if (err.code === 'LIMIT_FILE_COUNT') {
            return res.status(400).json({
                success: false,
                message: 'Demasiados archivos. Máximo 10 archivos permitidos.'
            });
        }
        return res.status(400).json({
            success: false,
            message: `Error de carga: ${err.message}`
        });
    } else if (err.message === 'Solo se permiten archivos de imagen') {
        return res.status(400).json({
            success: false,
            message: err.message
        });
    }

    // Si no es un error de multer, continuar al siguiente manejador
    next(err);
});

// Testing route
app.get('/', (req, res) => {
    res.send('Hello and welcome to Sesa Application');
});

// Endpoint para verificar la conexión a S3
app.get('/api/check-s3', async (req, res) => {
    try {
        // Listar buckets como prueba de conexión
        const data = await s3.listBuckets().promise();
        res.status(200).json({
            success: true,
            message: 'Conexión a S3 establecida correctamente',
            buckets: data.Buckets.map(bucket => bucket.Name)
        });
    } catch (error) {
        console.error('Error al verificar la conexión con S3:', error);
        res.status(500).json({
            success: false,
            message: 'Error al conectar con S3',
            error: error.message
        });
    }
});

// Error handling middleware general
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        success: false,
        message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : 'Algo salió mal'
    });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Server Sesa is running on port ${port}`);
    console.log(`S3 upload endpoint available at http://localhost:${port}/api/upload`);
});