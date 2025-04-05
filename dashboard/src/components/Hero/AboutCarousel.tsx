import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const AboutCarousel = () => {
    // Estado para controlar la imagen actual
    const [currentImage, setCurrentImage] = useState(0);
    // Estado para controlar si está en transición
    const [isTransitioning, setIsTransitioning] = useState(false);

    // Array de imágenes de ejemplo (reemplazar con tus imágenes reales)
    const images = [
        "/assets/home-carousel/taza-carousel2.avif",
        "/assets/home-carousel/sudadera-carousel.avif",
        "/assets/home-carousel/termo-carousel.avif",
        "/assets/home-carousel/camisa-carousel.avif",
    ];

    // Función para ir a la imagen anterior
    const prevImage = () => {
        if (isTransitioning) return; // Evitar múltiples clics durante la transición

        setIsTransitioning(true);
        setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));

        // Permitir nueva transición después de completarse la actual
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500); // Debe coincidir con la duración de la transición en CSS
    };

    // Función para ir a la siguiente imagen
    const nextImage = () => {
        if (isTransitioning) return; // Evitar múltiples clics durante la transición

        setIsTransitioning(true);
        setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));

        // Permitir nueva transición después de completarse la actual
        setTimeout(() => {
            setIsTransitioning(false);
        }, 500); // Debe coincidir con la duración de la transición en CSS
    };

    // Efecto para avanzar automáticamente cada 5 segundos
    useEffect(() => {
        if (isTransitioning) return; // No iniciar nuevo intervalo si está en transición

        const interval = setInterval(() => {
            nextImage();
        }, 5000);

        return () => clearInterval(interval);
    }, [isTransitioning]);

    return (
        <div className="w-full max-w-md mx-auto aspect-square">
            {/* Contenedor principal del carrusel - aspecto cuadrado responsivo */}
            <div className="relative w-full h-full overflow-hidden rounded-lg shadow-lg">
                {/* Contenedor de imágenes con posición absoluta para cada imagen */}
                <div className="relative w-full h-full">
                    {images.map((src, index) => (
                        <div
                            key={index}
                            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-500 ease-in-out ${
                                currentImage === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                        >
                            <img
                                src={src}
                                alt={`Slide ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>

                {/* Botones de navegación con z-index elevado para asegurar que estén por encima de las imágenes */}
                <button
                    onClick={prevImage}
                    disabled={isTransitioning}
                    className={`absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all z-30 cursor-pointer ${
                        isTransitioning ? 'opacity-50' : ''
                    }`}
                    aria-label="Imagen anterior"
                >
                    <ChevronLeft size={24} color="#000000" />
                </button>

                <button
                    onClick={nextImage}
                    disabled={isTransitioning}
                    className={`absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-50 rounded-full p-2 hover:bg-opacity-70 transition-all z-30 cursor-pointer ${
                        isTransitioning ? 'opacity-50' : ''
                    }`}
                    aria-label="Imagen siguiente"
                >
                    <ChevronRight size={24} color="#000000" />
                </button>

                {/* Indicadores de posición */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2 z-20">
                    {images.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                if (!isTransitioning) {
                                    setIsTransitioning(true);
                                    setCurrentImage(index);
                                    setTimeout(() => {
                                        setIsTransitioning(false);
                                    }, 500);
                                }
                            }}
                            disabled={isTransitioning}
                            className={`w-3 h-3 rounded-full transition-all ${
                                currentImage === index ? 'bg-white' : 'bg-gray-400 bg-opacity-50'
                            } ${isTransitioning ? 'cursor-not-allowed' : ''}`}
                            aria-label={`Ir a la imagen ${index + 1}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutCarousel;