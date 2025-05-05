import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient.ts';
import ProductCard from '../../components/products/ProductCard.tsx';
import { Product, transformProductData } from '../../types/product';
import Layout from '../../components/common/Layout';
import { Search } from 'lucide-react';

// Types for filtering and sorting
type SortOption = {
    field: keyof Product;
    direction: 'asc' | 'desc';
    label: string;
};

const ProductPage: React.FC = () => {
    // State
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

    // Sort options
    const sortOptions: SortOption[] = [
        { field: 'name', direction: 'asc', label: 'Nombre (A-Z)' },
        { field: 'name', direction: 'desc', label: 'Nombre (Z-A)' },
        { field: 'price', direction: 'asc', label: 'Precio (menor a mayor)' },
        { field: 'price', direction: 'desc', label: 'Precio (mayor a menor)' },
    ];

    // Fetch products and categories on component mount
    useEffect(() => {
        const fetchProductsAndCategories = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch categories
                const { data: categoriesData, error: categoriesError } = await supabase
                    .from('categories')
                    .select('id, name')
                    .order('name', { ascending: true });

                if (categoriesError) throw categoriesError;

                setCategories(categoriesData || []);

                // Fetch products with joined category information
                const { data: productsData, error: productsError } = await supabase
                    .from('products')
                    .select(`
            *,
            categories:category_id(id, name),
            product_images(id, url, is_primary)
          `);

                if (productsError) throw productsError;

                if (productsData) {
                    // Transform the data to match our Product interface
                    const formattedProducts: Product[] = productsData.map(product => {
                        // Find primary image
                        const primaryImage = product.product_images?.find((img: any) => img.is_primary);

                        // Transform to match our Product type
                        return {
                            ...transformProductData(product),
                            // Add primary image URL if available
                            primary_image_url: primaryImage?.url || undefined
                        };
                    });

                    setProducts(formattedProducts);
                } else {
                    setProducts([]);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
                setError(err instanceof Error ? err.message : 'Error al cargar los productos');
            } finally {
                setLoading(false);
            }
        };

        fetchProductsAndCategories();
    }, []);

    // Filter and sort products
    const getFilteredAndSortedProducts = () => {
        let filteredProducts = [...products];

        // Filter by search term
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(term) ||
                (product.description && product.description.toLowerCase().includes(term)) ||
                (product.sku && product.sku.toLowerCase().includes(term))
            );
        }

        // Filter by category
        if (selectedCategory !== null) {
            filteredProducts = filteredProducts.filter(product =>
                product.category_id === selectedCategory
            );
        }

        // Sort products
        return filteredProducts.sort((a, b) => {
            const aValue = a[sortOption.field];
            const bValue = b[sortOption.field];

            // Handle undefined values
            if (aValue === undefined && bValue === undefined) return 0;
            if (aValue === undefined) return 1;
            if (bValue === undefined) return -1;

            // Compare values based on sort direction
            if (aValue < bValue) {
                return sortOption.direction === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortOption.direction === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    // Handle product click
    const handleProductClick = (product: Product) => {
        // Navigate to product detail page
        window.location.href = `/product/${product.id}`;
    };

    return (
        <Layout title="Productos - SESA PROMO">
            <div className="container mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Nuestros Productos</h1>

                {/* Filters and Search */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Search */}
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

                        {/* Category filter */}
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

                        {/* Sort options */}
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

                {/* Product Grid */}
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
                        {/* Product count */}
                        <div className="mb-4 text-gray-600">
                            Mostrando {getFilteredAndSortedProducts().length} productos
                        </div>

                        {/* Product grid */}
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