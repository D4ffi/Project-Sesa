// src/pages/Products/ProductsPage.tsx
import { useState, useEffect, useRef, useCallback } from 'react';
import { supabase } from '../../utils/supabaseClient';
import Layout from '../../components/common/Layout';
import ProductCard from '../../components/products/ProductCard';

// Define proper types for the nested structures
type ProductImage = {
    url: string;
    is_primary: boolean;
};

type CategoryData = {
    id: number;
    name: string;
};

// Full product type with proper nested types
type Product = {
    id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    category_id: number;
    primary_image_url?: string | null;
    dimensions?: string;
    material?: string;
    category_name?: string;
    product_images?: ProductImage[];
    categories?: CategoryData;
};

// Type for raw data from Supabase
type ProductRawData = {
    id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    category_id: number;
    dimensions?: string;
    material?: string;
    product_images?: ProductImage[] | null;
    categories?: CategoryData | null;
    [key: string]: unknown; // For other properties we might not care about
};

const ProductsPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const productsPerPage = 10;

    // Reference for the intersection observer
    const observer = useRef<IntersectionObserver | null>(null);
    const lastProductElementRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;

        // Disconnect previous observer
        if (observer.current) observer.current.disconnect();

        // Create a new observer
        observer.current = new IntersectionObserver(entries => {
            // If the last element is visible and there are more products to load
            if (entries[0].isIntersecting && hasMore) {
                setPage(prevPage => prevPage + 1);
            }
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.1
        });

        // Observe the new last element
        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    // Load initial products
    useEffect(() => {
        void fetchProducts();
    }, []);

    // Load more products when page changes
    useEffect(() => {
        if (page > 0) {
            void fetchMoreProducts();
        }
    }, [page]);

    const fetchProducts = async (): Promise<void> => {
        try {
            setLoading(true);

            // Initial products query
            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          categories:category_id(id, name),
          product_images(url, is_primary)
        `)
                .range(0, productsPerPage - 1)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const formattedProducts = formatProductData(data || []);
            setProducts(formattedProducts);

            // Check if there are more products
            const { count, error: countError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            if (countError) throw countError;
            setHasMore(formattedProducts.length < (count || 0));
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err instanceof Error ? err.message : 'Error al cargar productos');
        } finally {
            setLoading(false);
        }
    };

    const fetchMoreProducts = async (): Promise<void> => {
        if (!hasMore || loading) return;

        try {
            setLoading(true);

            // Calculate range of products to load
            const from = page * productsPerPage;
            const to = from + productsPerPage - 1;

            // Load more products
            const { data, error } = await supabase
                .from('products')
                .select(`
          *,
          categories:category_id(id, name),
          product_images(url, is_primary)
        `)
                .range(from, to)
                .order('created_at', { ascending: false });

            if (error) throw error;

            const newProducts = formatProductData(data || []);

            // If no more products
            if (newProducts.length === 0) {
                setHasMore(false);
            } else {
                // Combine with existing products
                setProducts(prev => [...prev, ...newProducts]);
            }
        } catch (err) {
            console.error('Error fetching more products:', err);
            setError(err instanceof Error ? err.message : 'Error al cargar más productos');
        } finally {
            setLoading(false);
        }
    };

    // Function to format product data
    const formatProductData = (data: ProductRawData[]): Product[] => {
        return data.map(product => {
            // Ensure product_images is treated as an array
            const productImages: ProductImage[] = Array.isArray(product.product_images)
                ? product.product_images
                : [];

            // Find primary image
            const primaryImage = productImages.find(img => img.is_primary);

            // If no primary image, use first image
            const firstImage = productImages.length > 0 ? productImages[0] : null;

            // Get category name safely
            let categoryName = 'Sin categoría';
            if (product.categories) {
                if (Array.isArray(product.categories) && product.categories.length > 0) {
                    categoryName = product.categories[0].name || 'Sin categoría';
                } else if (typeof product.categories === 'object' && product.categories !== null) {
                    categoryName = (product.categories as CategoryData).name || 'Sin categoría';
                }
            }

            return {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                sku: product.sku,
                category_id: product.category_id,
                dimensions: product.dimensions,
                material: product.material,
                primary_image_url: primaryImage?.url || firstImage?.url || null,
                category_name: categoryName,
                product_images: productImages
            };
        });
    };

    return (
        <Layout title="Productos | SESA PROMO">
            <div className="container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-8">Nuestros Productos</h1>

                {/* Section description */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-3">Productos Promocionales</h2>
                    <p className="text-gray-600">
                        Descubre nuestra amplia gama de productos promocionales personalizables.
                        Ideal para empresas que buscan destacar su marca con artículos de alta calidad.
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
                        <p>{error}</p>
                    </div>
                )}

                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {products.length === 0 && !loading ? (
                        <div className="col-span-full text-center py-12">
                            <p className="text-gray-500">No se encontraron productos</p>
                        </div>
                    ) : (
                        products.map((product, index) => {
                            // If it's the last product, add ref for the observer
                            if (index === products.length - 1) {
                                return (
                                    <div key={product.id} ref={lastProductElementRef}>
                                        <ProductCard product={product} />
                                    </div>
                                );
                            } else {
                                return <ProductCard key={product.id} product={product} />;
                            }
                        })
                    )}
                </div>

                {/* Loading indicator */}
                {loading && (
                    <div className="flex justify-center mt-8">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
                    </div>
                )}

                {/* No more products message */}
                {!hasMore && products.length > 0 && (
                    <div className="text-center mt-8 py-4 text-gray-500 border-t border-gray-200">
                        No hay más productos para mostrar
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ProductsPage;