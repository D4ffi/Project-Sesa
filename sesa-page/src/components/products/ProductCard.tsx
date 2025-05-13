// sesa-page/src/components/products/ProductCard.tsx
import React from 'react';
import { Product } from '../../types/product';
import LazyImage from '../common/LazyImage';
import { getFallbackImageUrl } from '../../utils/imageUtils';

interface ProductCardProps {
    product: Product;
    onClick?: (product: Product) => void;
}

/**
 * Componente de tarjeta de producto mejorado que muestra imagen desde Supabase Storage
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    // Manejar el evento de clic si se proporciona
    const handleClick = () => {
        if (onClick) {
            onClick(product);
        }
    };

    // Obtener imagen de respaldo
    const fallbackImage = getFallbackImageUrl();

    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            onClick={handleClick}
        >
            {/* Imagen del Producto con carga perezosa */}
            <div className="relative h-48 overflow-hidden">
                <LazyImage
                    src={product.primary_image_url || ''}
                    alt={product.name}
                    fallbackSrc={fallbackImage}
                    className="w-full h-full"
                    objectFit="cover"
                />

                {/* Etiqueta de categoría - si está disponible */}
                {product.category_name && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            {product.category_name}
          </span>
                )}
            </div>

            {/* Información del Producto */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>

                {/* Descripción del producto - truncada */}
                {product.description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                )}

                {/* Precio */}
                <div className="flex items-center justify-between mt-2">
          <span className="text-orange-500 font-bold">
            ${typeof product.price === 'number'
              ? product.price.toLocaleString('es-MX')
              : product.price}
          </span>

                    {/* SKU si está disponible */}
                    {product.sku && (
                        <span className="text-gray-500 text-xs">SKU: {product.sku}</span>
                    )}
                </div>

                {/* Detalles adicionales si están disponibles */}
                <div className="mt-2 text-xs text-gray-500">
                    {product.material && <span className="block">Material: {product.material}</span>}
                    {product.dimensions && <span className="block">Dimensiones: {product.dimensions}</span>}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;