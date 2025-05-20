// Corrección mejorada para dashboard/src/components/Productos/MultipleImageUploader.tsx
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';
import { Plus } from 'lucide-react';

interface ProductImage {
    url: string;
    path: string;
    isPrimary: boolean;
}

interface MultipleImageUploaderProps {
    productId?: number | string;
    onImagesChange: (images: ProductImage[]) => void;
    initialImages?: ProductImage[];
    maxImages?: number;
}

const MultipleImageUploader: React.FC<MultipleImageUploaderProps> = ({
                                                                         productId,
                                                                         onImagesChange,
                                                                         initialImages = [],
                                                                         maxImages = 5
                                                                     }) => {
    const [images, setImages] = useState<ProductImage[]>(initialImages);
    const [error, setError] = useState<string | null>(null);
    const [showUploader, setShowUploader] = useState<boolean>(false);

    // Manejador para cuando se sube una nueva imagen
    const handleImageUploaded = (url: string, path: string) => {
        if (images.length >= maxImages) {
            setError(`No puedes subir más de ${maxImages} imágenes`);
            return;
        }

        // Determinar si debe ser primaria (primera imagen es primaria por defecto)
        const isPrimary = images.length === 0;

        // Crear nueva matriz de imágenes
        const newImages = [...images, { url, path, isPrimary }];

        // Actualizar estado
        setImages(newImages);

        // Notificar al componente padre
        onImagesChange(newImages);

        // Ocultar el uploader después de subir la imagen
        setShowUploader(false);

        // Limpiar error
        setError(null);
    };

    // Manejador para establecer imagen primaria
    const handleSetPrimary = (index: number) => {
        const newImages = images.map((img, i) => ({
            ...img,
            isPrimary: i === index
        }));

        setImages(newImages);
        onImagesChange(newImages);
    };

    // Manejador para eliminar una imagen
    const handleRemoveImage = (index: number) => {
        // Crear nueva matriz sin la imagen eliminada
        const newImages = images.filter((_, i) => i !== index);

        // Si hemos eliminado la imagen primaria y todavía hay imágenes, establecer la primera como primaria
        if (images[index].isPrimary && newImages.length > 0) {
            newImages[0].isPrimary = true;
        }

        // Actualizar estado
        setImages(newImages);

        // Notificar al componente padre
        onImagesChange(newImages);
    };

    return (
        <div className="space-y-4">
            {error && (
                <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            {/* Imágenes subidas */}
            {images.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {images.map((image, index) => (
                        <div key={index} className="border rounded-lg p-3">
                            <img
                                src={image.url}
                                alt={`Imagen del producto ${index + 1}`}
                                className="w-full h-32 object-contain mb-2"
                            />
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        type="radio"
                                        id={`primary-${index}`}
                                        name="primary-image"
                                        checked={image.isPrimary}
                                        onChange={() => handleSetPrimary(index)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={`primary-${index}`} className="text-xs">
                                        Imagen principal
                                    </label>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="text-xs text-red-500 hover:text-red-700"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Botón para mostrar el uploader + componente de subida */}
            {!showUploader && images.length < maxImages ? (
                <button
                    type="button"
                    onClick={() => setShowUploader(true)}
                    className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 hover:border-orange-300 transition-colors"
                >
                    <Plus size={20} className="text-gray-400 mr-2" />
                    <span className="text-gray-500">Agregar imagen {images.length + 1} de {maxImages}</span>
                </button>
            ) : showUploader && (
                <div className="mt-4">
                    <ImageUploader
                        onImageUploaded={handleImageUploaded}
                        productId={productId}
                        onRemove={() => setShowUploader(false)}
                    />
                    <button
                        type="button"
                        onClick={() => setShowUploader(false)}
                        className="text-sm text-gray-500 mt-2 hover:text-gray-700"
                    >
                        Cancelar
                    </button>
                </div>
            )}

            <div className="text-xs text-gray-500 flex justify-between mt-2">
                <span>{images.length} de {maxImages} imágenes</span>
                {images.length > 0 && (
                    <span className="text-green-600">
                        {images.findIndex(img => img.isPrimary) !== -1 ? "✓ Imagen principal seleccionada" : "⚠️ Selecciona una imagen principal"}
                    </span>
                )}
            </div>
        </div>
    );
};

export default MultipleImageUploader;