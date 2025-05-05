import React from 'react';
import { Product, ProductCardProps } from '../types/product';

/**
 * Product Card component for displaying product information
 * Used in product listings and search results
 */
const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
    // Handle click event if provided
    const handleClick = () => {
        if (onClick) {
            onClick(product);
        }
    };

    // Calculate discount price if needed in the future
    // const discountPrice = product.discount ? product.price * (1 - product.discount / 100) : null;

    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            onClick={handleClick}
        >
            {/* Product Image */}
            <div className="relative h-48 bg-gray-200">
                {product.primary_image_url ? (
                    <img
                        src={product.primary_image_url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gray-100 text-gray-400">
                        No imagen disponible
                    </div>
                )}

                {/* Category label - if available */}
                {product.category_name && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            {product.category_name}
          </span>
                )}
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">{product.name}</h3>

                {/* Product description - truncated */}
                {product.description && (
                    <p className="text-gray-600 text-sm mb-2 line-clamp-2">{product.description}</p>
                )}

                {/* Price */}
                <div className="flex items-center justify-between mt-2">
                    <span className="text-orange-500 font-bold">${product.price.toLocaleString('es-MX')}</span>

                    {/* SKU if available */}
                    {product.sku && (
                        <span className="text-gray-500 text-xs">SKU: {product.sku}</span>
                    )}
                </div>

                {/* Additional product details if available */}
                <div className="mt-2 text-xs text-gray-500">
                    {product.material && <span className="block">Material: {product.material}</span>}
                    {product.dimensions && <span className="block">Dimensiones: {product.dimensions}</span>}
                </div>
            </div>
        </div>
    );
};

export default ProductCard;