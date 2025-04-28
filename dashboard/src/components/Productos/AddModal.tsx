import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Info } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Category {
    id: number;
    name: string;
    description?: string;
}

// URL del backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // Product form state
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        sku: '',
        category_id: '',
        dimensions: '',   // New field for dimensions
        material: '',     // New field for material
    });

    // Images handling
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [primaryImageIndex, setPrimaryImageIndex] = useState(0);
    const [imageAltTexts, setImageAltTexts] = useState<string[]>([]);

    // Categories for dropdown
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Display info about selected category
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
    const [showCategoryInfo, setShowCategoryInfo] = useState(false);

    // Fetch categories on component mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('categories')
                    .select('id, name, description')
                    .order('name', { ascending: true });

                if (error) throw error;

                setCategories(data || []);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Error al cargar categorías. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) fetchCategories();
    }, [isOpen]);

    // Update selected category when category_id changes
    useEffect(() => {
        if (formData.category_id) {
            const categoryId = parseInt(formData.category_id);
            const category = categories.find(cat => cat.id === categoryId) || null;
            setSelectedCategory(category);
        } else {
            setSelectedCategory(null);
        }
    }, [formData.category_id, categories]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);

            // Validar tamaño de archivos (5MB por archivo)
            const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB en bytes
            const oversizedFiles = filesArray.filter(file => file.size > MAX_FILE_SIZE);

            if (oversizedFiles.length > 0) {
                setError(`Los siguientes archivos exceden el límite de 5MB: ${
                    oversizedFiles.map(f => f.name).join(', ')
                }`);
                return;
            }

            // Validar número máximo de archivos (10 en total)
            if (selectedFiles.length + filesArray.length > 10) {
                setError('No puedes subir más de 10 imágenes por producto');
                return;
            }

            // Validar tipo de archivo (solo imágenes)
            const invalidFiles = filesArray.filter(file => !file.type.startsWith('image/'));
            if (invalidFiles.length > 0) {
                setError(`Los siguientes archivos no son imágenes: ${
                    invalidFiles.map(f => f.name).join(', ')
                }`);
                return;
            }

            setError(null);
            setSelectedFiles(prev => [...prev, ...filesArray]);

            // Initialize alt texts for new images
            setImageAltTexts(prev => [
                ...prev,
                ...Array(filesArray.length).fill('')
            ]);
        }
    };

    const removeImage = (index: number) => {
        setSelectedFiles(files => files.filter((_, i) => i !== index));
        setImageAltTexts(texts => texts.filter((_, i) => i !== index));

        // Adjust primary image index if needed
        if (primaryImageIndex === index) {
            setPrimaryImageIndex(0);
        } else if (primaryImageIndex > index) {
            setPrimaryImageIndex(primaryImageIndex - 1);
        }
    };

    const handleAltTextChange = (index: number, text: string) => {
        const newAltTexts = [...imageAltTexts];
        newAltTexts[index] = text;
        setImageAltTexts(newAltTexts);
    };

    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('El nombre del producto es obligatorio');
            return false;
        }

        if (!formData.category_id) {
            setError('Debe seleccionar una categoría');
            return false;
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            setError('El precio debe ser mayor que cero');
            return false;
        }

        return true;
    };

    // Función para subir imágenes a S3 a través del backend
    const uploadImagesToS3 = async (productId: number) => {
        if (selectedFiles.length === 0) return [];

        try {
            const formData = new FormData();
            formData.append('productId', productId.toString());

            // Agregar todas las imágenes al FormData
            selectedFiles.forEach((file) => {
                formData.append('images', file);
            });

            // Enviar las imágenes al endpoint del backend con manejo de timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60 segundos de timeout para archivos grandes

            const response = await fetch(`${API_URL}/api/upload`, {
                method: 'POST',
                body: formData,
                signal: controller.signal
            }).finally(() => {
                clearTimeout(timeoutId);
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al subir imágenes');
            }

            const result = await response.json();
            return result.files;
        } catch (error) {
            console.error('Error uploading images:', error);

            // Manejo específico de errores
            if (error instanceof Error && error.name === 'AbortError') {
                throw new Error('La carga de imágenes ha excedido el tiempo máximo. Intenta con archivos más pequeños o menos archivos.');
            }

            throw error;
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setLoading(true);
        setUploadProgress(0);

        try {
            // Insertar producto en Supabase
            const { data: productData, error: productError } = await supabase
                .from('products')
                .insert({
                    name: formData.name,
                    description: formData.description || null,
                    price: parseFloat(formData.price),
                    sku: formData.sku || null,
                    category_id: parseInt(formData.category_id),
                    dimensions: formData.dimensions || null,  // Include dimensions
                    material: formData.material || null,      // Include material
                })
                .select('id')
                .single();

            if (productError) throw productError;

            const productId = productData.id;
            setUploadProgress(30); // Progreso después de crear el producto

            // Subir imágenes a S3 si hay archivos seleccionados
            if (selectedFiles.length > 0) {
                // Subir imágenes a S3 a través del backend
                const uploadedFiles = await uploadImagesToS3(productId);
                setUploadProgress(70); // Progreso después de subir imágenes

                // Insertar información de las imágenes en Supabase
                for (let i = 0; i < uploadedFiles.length; i++) {
                    const file = uploadedFiles[i];
                    const isPrimary = i === primaryImageIndex;

                    const { error: imageError } = await supabase
                        .from('product_images')
                        .insert({
                            product_id: productId,
                            url: file.s3Url,
                            is_primary: isPrimary,
                            alt_text: imageAltTexts[i] || formData.name,
                            path: file.path // Guardamos la ruta en S3 por si necesitamos eliminar la imagen después
                        });

                    if (imageError) throw imageError;
                }
            }

            setUploadProgress(100); // Progreso completado

            // Reset form
            setFormData({
                name: '',
                description: '',
                price: '',
                sku: '',
                category_id: '',
                dimensions: '',
                material: '',
            });
            setSelectedFiles([]);
            setImageAltTexts([]);
            setPrimaryImageIndex(0);

            // Notify parent and close modal
            onSuccess();
            onClose();

        } catch (err) {
            console.error('Error adding product:', err);
            setError(err instanceof Error ? err.message : 'Ha ocurrido un error al guardar el producto');
        } finally {
            setLoading(false);
            setUploadProgress(0);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Agregar Nuevo Producto</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Product Information */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b pb-2">Información del Producto</h3>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Nombre <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Categoría <span className="text-red-500">*</span>
                                </label>
                                <div className="flex items-center space-x-2">
                                    <select
                                        name="category_id"
                                        value={formData.category_id}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        required
                                    >
                                        <option value="">Seleccionar categoría</option>
                                        {categories.map(category => (
                                            <option key={category.id} value={category.id}>
                                                {category.name} (ID: {category.id})
                                            </option>
                                        ))}
                                    </select>

                                    {formData.category_id && (
                                        <button
                                            type="button"
                                            onClick={() => setShowCategoryInfo(!showCategoryInfo)}
                                            className="p-2 text-blue-500 hover:text-blue-700 focus:outline-none"
                                        >
                                            <Info size={20} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Category info display */}
                            {showCategoryInfo && selectedCategory && (
                                <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md">
                                    <h4 className="font-semibold text-sm text-blue-800">Detalles de la categoría</h4>
                                    <p className="text-sm text-blue-700">ID: {selectedCategory.id}</p>
                                    <p className="text-sm text-blue-700">Nombre: {selectedCategory.name}</p>
                                    {selectedCategory.description && (
                                        <p className="text-sm text-blue-700">Descripción: {selectedCategory.description}</p>
                                    )}
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Precio <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleInputChange}
                                        className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        step="0.01"
                                        min="0"
                                        required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    SKU
                                </label>
                                <input
                                    type="text"
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* New field: Dimensions */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Dimensiones
                                </label>
                                <input
                                    type="text"
                                    name="dimensions"
                                    value={formData.dimensions}
                                    onChange={handleInputChange}
                                    placeholder="Ejemplo: 10x15x5 cm"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* New field: Material */}
                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Material
                                </label>
                                <input
                                    type="text"
                                    name="material"
                                    value={formData.material}
                                    onChange={handleInputChange}
                                    placeholder="Ejemplo: Algodón, Cerámica, etc."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-medium mb-1">
                                    Descripción
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows={4}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>
                        </div>

                        {/* Image Uploads */}
                        <div className="space-y-4">
                            <h3 className="font-semibold text-gray-700 border-b pb-2">Imágenes del Producto</h3>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                                <input
                                    type="file"
                                    id="product-images"
                                    multiple
                                    accept="image/*"
                                    onChange={handleFileSelect}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="product-images"
                                    className="cursor-pointer flex flex-col items-center justify-center"
                                >
                                    <Upload size={40} className="text-gray-400 mb-2" />
                                    <p className="text-gray-500">Haz clic para seleccionar imágenes</p>
                                    <p className="text-xs text-gray-400 mt-1">o arrastra y suelta aquí</p>
                                    <div className="mt-3 text-xs text-gray-500">
                                        <p>Máximo 10 imágenes por producto</p>
                                        <p>Tamaño máximo: 5MB por imagen</p>
                                        <p>Formatos aceptados: JPG, PNG, GIF, WebP</p>
                                    </div>
                                </label>
                            </div>

                            {selectedFiles.length > 0 && (
                                <div className="space-y-3">
                                    <p className="text-sm text-gray-600">
                                        Imágenes seleccionadas ({selectedFiles.length})
                                    </p>

                                    {selectedFiles.map((file, index) => (
                                        <div key={index} className="border rounded-lg p-3 flex items-start space-x-4">
                                            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 flex items-center justify-center rounded">
                                                <ImageIcon size={28} className="text-gray-400" />
                                            </div>

                                            <div className="flex-grow">
                                                <div className="flex justify-between">
                                                    <p className="text-sm font-medium text-gray-700 truncate">
                                                        {file.name}
                                                    </p>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeImage(index)}
                                                        className="text-gray-400 hover:text-red-500"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>

                                                <p className="text-xs text-gray-500 mt-1">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </p>

                                                <div className="mt-2 space-y-2">
                                                    <div className="flex items-center">
                                                        <input
                                                            type="radio"
                                                            id={`primary-${index}`}
                                                            name="primary-image"
                                                            checked={primaryImageIndex === index}
                                                            onChange={() => setPrimaryImageIndex(index)}
                                                            className="mr-2"
                                                        />
                                                        <label htmlFor={`primary-${index}`} className="text-xs text-gray-600">
                                                            Imagen principal
                                                        </label>
                                                    </div>

                                                    <input
                                                        type="text"
                                                        placeholder="Texto alternativo"
                                                        value={imageAltTexts[index] || ''}
                                                        onChange={(e) => handleAltTextChange(index, e.target.value)}
                                                        className="w-full text-xs px-2 py-1 border border-gray-300 rounded"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Barra de progreso (visible durante la carga) */}
                    {loading && uploadProgress > 0 && (
                        <div className="mt-4">
                            <div className="relative pt-1">
                                <div className="flex mb-2 items-center justify-between">
                                    <div>
                                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-orange-600 bg-orange-200">
                                            {uploadProgress < 100 ? 'Subiendo...' : 'Completado'}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-xs font-semibold inline-block text-orange-600">
                                            {uploadProgress}%
                                        </span>
                                    </div>
                                </div>
                                <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-orange-200">
                                    <div
                                        style={{ width: `${uploadProgress}%` }}
                                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-orange-500 transition-all duration-500">
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 border-t pt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Producto'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProductModal;