// src/components/Products/ProductCard.tsx
import { useNavigate } from 'react-router-dom';

type ProductCardProps = {
    product: {
        id: number;
        name: string;
        price: number;
        primary_image_url?: string;
        category_name?: string;
    };
};

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    const navigate = useNavigate();

    const goToProductDetail = () => {
        navigate(`/products/${product.id}`);
    };

    // Formatear precio para visualización
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    const imagePlaceholder = '/assets/product-placeholder.jpg';

    return (
        <div
            className="bg-white rounded-lg shadow-md overflow-hidden transition-transform hover:shadow-lg hover:-translate-y-1 cursor-pointer duration-300"
            onClick={goToProductDetail}
        >
            {/* Imagen (contenedor cuadrado) */}
            <div className="aspect-square w-full overflow-hidden bg-gray-100 relative">
                <img
                    src={product.primary_image_url || imagePlaceholder}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = imagePlaceholder;
                    }}
                />
                {product.category_name && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-xs px-2 py-1 rounded">
            {product.category_name}
          </span>
                )}
            </div>

            {/* Información del producto */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-1 truncate">
                    {product.name}
                </h3>
                <p className="text-orange-500 font-bold">
                    {formatPrice(product.price)}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;