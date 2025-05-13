// sesa-page/src/pages/Products/Products.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import ProductCard from '../../components/products/ProductCard';
import { Product, transformProductData } from '../../types/product';
import Layout from '../../components/common/Layout';
import { Search } from 'lucide-react';

// Tipos para filtrado y ordenamiento
type SortOption = {
    field: keyof Product;
    direction: 'asc' | 'desc';
    label: string;
};

/**
 * Página de productos mejorada que carga imágenes desde Supabase Storage
 */
const ProductPage: React.FC = () => {
    // Estado
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [sortOption, setSortOption] = useState<SortOption>({
        field: 'name',
        direction: 'asc',
        label: 'Nombre (A-Z)'
    });

    // Opciones de ordenamiento
    const sortOptions: SortOption[] = [
        { field: 'name', direction: 'asc', label: 'Nombre (A-Z)' },
        { field: 'name', direction: 'desc', label: 'Nombre (Z-A)' },
        { field: 'price', direction: 'asc', label: 'Precio (menor a mayor)' },
        { field: 'price', direction: 'desc', label: 'Precio (mayor a menor)' },
    ];

    // Obtener productos y categorías al montar el componente
    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                setLoading(true);
                setError(null);

                // Obtener categorías
                const { data: categoriesData, error: categoriesError } = await supabase
                    .from('categories')
                    .select('id, name')
                    .order('name', { ascending: true });

                if (categoriesError) throw categoriesError;
                setCategories(categoriesData || []);

                // Obtener productos con información de categoría e imágenes
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select(`
            *,
            categories:category_id(id, name),
            product_images(id, url, is_primary, alt_text)
          `);

                if (productsError) throw productsError;

                if (productsData) {
                    // Transformar los datos para que coincidan con nuestra interfaz Product
                    const formattedProducts: Product[] = productsData.map(product => {
                        // Encontrar la imagen principal
                        const primaryImage = product.product_images?.find((img: any) => img.is_primary);

                        // Si no hay imagen principal pero hay imágenes, usar la primera
                        const firstImage = product.product_images?.length > 0 ? product.product_images[0] : null;

                        return {
                            ...transformProductData(product),
                            // Añadir URL de imagen principal si está disponible
                            primary_image_url: primaryImage?.url || firstImage?.url || undefined
                        };
                    });

                    setProducts(formattedProducts);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error('Error al obtener datos:', err);
                setError(err instanceof Error ? err.message : 'Error al cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndCategories();
    }, []);

    // Filtrar y ordenar productos
    const getFilteredAndSortedProducts = () => {
        let filteredProducts = [...products];

        // Filtrar por término de búsqueda
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(term) ||
                (product.description && product.description.toLowerCase().includes(term)) ||
                (product.sku && product.sku.toLowerCase().includes(term)) ||
                (product.material && product.material.toLowerCase().includes(term)) ||
                (product.dimensions && product.dimensions.toLowerCase().includes(term))
            );
        }

        // Filtrar por categoría
        if (selectedCategory !== null) {
            filteredProducts = filteredProducts.filter(product =>
                product.category_id === selectedCategory
            );
        }

        // Ordenar productos
        return filteredProducts.sort((a, b) => {
            const aValue = a[sortOption.field];
            const bValue = b[sortOption.field];

            // Manejar valores undefined
            if (aValue === undefined && bValue === undefined) return 0;
            if (aValue === undefined) return 1;
            if (bValue === undefined) return -1;

            // Comparar valores según dirección de ordenamiento
            if (aValue < bValue) {
                return sortOption.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortOption.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    // Manejar clic en producto
    const handleProductClick = (product: Product) => {
        // Navegar a la página de detalle del producto
        window.location.href = `/product/${product.id}`;
    };

    return (
        <Layout title="Productos - SESA PROMO">
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Nuestros Productos</h1>

                {/* Filtros y Búsqueda */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Búsqueda */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Buscar productos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        </div>

                        {/* Filtro de categoría */}
                        <div>
                            <select
                                value={selectedCategory !== null ? selectedCategory : ''}
                                onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Opciones de ordenamiento */}
                        <div>
                            <select
                                value={`${sortOption.field}-${sortOption.direction}`}
                                onChange={(e) => {
                                    const [field, direction] = e.target.value.split('-') as [keyof Product, 'asc' | 'desc'];
                                    const option = sortOptions.find(opt => opt.field === field && opt.direction === direction);
                                    if (option) {
                                        setSortOption(option);
                                    }
                                }}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {sortOptions.map((option, index) => (
                                    <option key={index} value={`${option.field}-${option.direction}`}>
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Grid de Productos */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                ) : error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                ) : (
                    <>
                        {/* Contador de productos */}
                        <div className="mb-4 text-gray-600">
                            Mostrando {getFilteredAndSortedProducts().length} productos
                        </div>

                        {/* Grid de productos */}
                        {getFilteredAndSortedProducts().length === 0 ? (
                            <div className="bg-gray-100 rounded-lg p-8 text-center">
                                <p className="text-gray-500">No se encontraron productos que coincidan con tu búsqueda.</p>
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedCategory(null);
                                    }}
                                    className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
                                >
                                    Mostrar todos los productos
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {getFilteredAndSortedProducts().map((product) => (
                                    <ProductCard
                                        key={product.id}
                                        product={product}
                                        onClick={handleProductClick}
                                    />
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>
        </Layout>
    );
};

export default ProductPage;