// dashboard/src/components/Productos/ImageUploader.tsx
import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import useSupabaseImages from '../../hooks/useSupabaseImages';

interface ImageUploaderProps {
    onImageUploaded: (url: string, path: string) => void;
    productId?: number | string; // Opcional: ID del producto para organización
    maxSize?: number; // Tamaño máximo en MB
    initialImageUrl?: string;
    initialImagePath?: string;
    isPrimary?: boolean;
    onSetPrimary?: (isPrimary: boolean) => void;
    onRemove?: () => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
                                                         onImageUploaded,
                                                         productId,
                                                         maxSize = 5, // Default 5MB
                                                         initialImageUrl,
                                                         initialImagePath,
                                                         isPrimary = false,
                                                         onSetPrimary,
                                                         onRemove
                                                     }) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl || null);
    const [imagePath, setImagePath] = useState<string | null>(initialImagePath || null);
    const [error, setError] = useState<string | null>(null);

    const {
        uploadImage,
        deleteImage,
        isUploading,
        uploadProgress,
        uploadError
    } = useSupabaseImages();

    // Manejar selección de archivo
    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validar tipo de archivo
        if (!file.type.startsWith('image/')) {
            setError('Solo se permiten archivos de imagen');
            return;
        }

        // Validar tamaño
        if (file.size > maxSize * 1024 * 1024) {
            setError(`El archivo excede el tamaño máximo de ${maxSize}MB`);
            return;
        }

        setError(null);

        // Generar preview
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        // Subir a Supabase
        const folder = productId ? `products/${productId}` : 'products';
        const result = await uploadImage(file, folder);

        // Limpiar preview temporal
        URL.revokeObjectURL(objectUrl);

        // Verificar resultado
        if (result.url && result.path) {
            setPreviewUrl(result.url);
            setImagePath(result.path);
            onImageUploaded(result.url, result.path);
        } else {
            setPreviewUrl(null);
            setError(uploadError || 'Error al subir imagen');
        }
    };

    // Manejar eliminación
    const handleRemoveImage = async () => {
        if (imagePath) {
            await deleteImage(imagePath);
        }

        setPreviewUrl(null);
        setImagePath(null);

        if (onRemove) {
            onRemove();
        }
    };

    return (
        <div className="border rounded-lg p-4 mb-4">
            {error && (
                <div className="mb-3 p-2 bg-red-100 border border-red-400 text-red-700 text-sm rounded">
                    {error}
                </div>
            )}

            {!previewUrl ? (
                // Área de carga
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50">
                    <input
                        type="file"
                        className="hidden"
                        id={`image-upload-${productId || 'new'}`}
                        accept="image/*"
                        onChange={handleFileSelect}
                    />
                    <label
                        htmlFor={`image-upload-${productId || 'new'}`}
                        className="cursor-pointer flex flex-col items-center"
                    >
                        <Upload size={24} className="text-gray-400 mb-2" />
                        <span className="text-gray-500 text-sm mb-1">Haz clic para seleccionar</span>
                        <span className="text-gray-400 text-xs">JPG, PNG o GIF (Máx. {maxSize}MB)</span>
                    </label>
                </div>
            ) : (
                // Vista previa
                <div className="relative">
                    <div className="group relative h-40 bg-gray-100 rounded-lg overflow-hidden">
                        <img
                            src={previewUrl}
                            alt="Vista previa"
                            className="w-full h-full object-contain"
                        />

                        {/* Botones de acción - remover y marcar como primaria */}
                        <div className="absolute top-0 right-0 p-2 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                                type="button"
                                onClick={handleRemoveImage}
                                className="p-1 bg-white text-red-500 rounded-full shadow hover:bg-red-100"
                                title="Eliminar imagen"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    </div>

                    {/* Control para imagen principal */}
                    {onSetPrimary && (
                        <div className="mt-2 flex items-center">
                            <input
                                type="checkbox"
                                id={`primary-${productId || 'new'}`}
                                checked={isPrimary}
                                onChange={(e) => onSetPrimary(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor={`primary-${productId || 'new'}`} className="text-xs">
                                Imagen principal
                            </label>
                        </div>
                    )}
                </div>
            )}

            {/* Barra de progreso */}
            {isUploading && (
                <div className="mt-3">
                    <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-orange-500 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                    <div className="text-xs text-gray-500 mt-1 text-right">
                        {uploadProgress}%
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;