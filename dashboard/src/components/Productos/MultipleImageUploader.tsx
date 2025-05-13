// dashboard/src/components/Productos/MultipleImageUploader.tsx
import React, { useState } from 'react';
import ImageUploader from './ImageUploader';

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

/**
 * Componente para subir múltiples imágenes de producto
 */
const MultipleImageUploader: React.FC<MultipleImageUploaderProps> = ({
                                                                         productId,
                                                                         onImagesChange,
                                                                         initialImages = [],
                                                                         maxImages = 5
                                                                     }) => {
    const [images, setImages] = useState<ProductImage[]>(initialImages);
    const [error, setError] = useState<string | null>(null);

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Imágenes existentes */}
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

                {/* Nuevo cargador - solo mostrar si no se ha alcanzado el límite */}
                {images.length < maxImages && (
                    <ImageUploader
                        onImageUploaded={handleImageUploaded}
                        productId={productId}
                    />
                )}
            </div>

            <div className="text-xs text-gray-500 mt-2">
                {images.length} de {maxImages} imágenes cargadas
            </div>
        </div>
    );
};

export default MultipleImageUploader;