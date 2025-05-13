// sesa-page/src/components/common/LazyImage.tsx
import React, { useState, useEffect } from 'react';
import { getFallbackImageUrl } from '../../utils/imageUtils';

interface LazyImageProps {
    src: string;
    alt: string;
    fallbackSrc?: string;
    className?: string;
    width?: string | number;
    height?: string | number;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
}

/**
 * Componente de imagen con carga perezosa y placeholder
 * Mejora el rendimiento y la experiencia del usuario durante la carga de imágenes
 */
const LazyImage: React.FC<LazyImageProps> = ({
                                                 src,
                                                 alt,
                                                 fallbackSrc,
                                                 className = '',
                                                 width = '100%',
                                                 height = '100%',
                                                 objectFit = 'cover'
                                             }) => {
    // Estado para controlar la URL de la imagen mostrada
    const [imgSrc, setImgSrc] = useState<string>('');
    // Estado para controlar si la imagen está cargada
    const [isLoaded, setIsLoaded] = useState<boolean>(false);
    // Estado para controlar si la imagen ha fallado
    const [hasError, setHasError] = useState<boolean>(false);

    // URL de respaldo predeterminada
    const defaultFallback = getFallbackImageUrl();

    // Efecto para cargar la imagen
    useEffect(() => {
        // Restablecer estados cuando cambia la URL
        setIsLoaded(false);
        setHasError(false);

        // No intentar cargar si no hay URL
        if (!src) {
            setHasError(true);
            return;
        }

        // Crear objeto de imagen para precargar
        const img = new Image();

        // Configurar manejadores de eventos
        img.onload = () => {
            setImgSrc(src);
            setIsLoaded(true);
        };

        img.onerror = () => {
            setHasError(true);
            // Usar imagen de respaldo proporcionada o la predeterminada
            setImgSrc(fallbackSrc || defaultFallback);
            setIsLoaded(true);
        };

        // Iniciar carga
        img.src = src;

        // Limpieza
        return () => {
            img.onload = null;
            img.onerror = null;
        };
    }, [src, fallbackSrc, defaultFallback]);

    return (
        <div
            className="relative bg-gray-100 overflow-hidden"
            style={{ width, height }}
        >
            {/* Placeholder de carga */}
            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 animate-pulse">
                    <svg
                        className="w-10 h-10 text-gray-300"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                    >
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                    </svg>
                </div>
            )}

            {/* Imagen */}
            <img
                src={imgSrc || (hasError ? (fallbackSrc || defaultFallback) : '')}
                alt={alt}
                className={`transition-opacity duration-300 ${className}`}
                style={{
                    opacity: isLoaded ? 1 : 0,
                    objectFit,
                    width: '100%',
                    height: '100%'
                }}
                onLoad={() => setIsLoaded(true)}
                onError={() => {
                    setHasError(true);
                    setImgSrc(fallbackSrc || defaultFallback);
                }}
            />
        </div>
    );
};

export default LazyImage;