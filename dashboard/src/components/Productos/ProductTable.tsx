import React, { useState, useEffect } from 'react';
import { Edit, Trash2, CheckSquare, Square, ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient.ts';
import EditProductModal from "./EditModal.tsx";
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';
import { STORAGE_BUCKET } from "../../utils/imageUtils.ts";

// Product type based on your database schema
type Product = {
    id: number;
    created_at: string;
    category_id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    category_name?: string;
    dimensions?: string;
    material?: string;
};

// Sorting options type
type SortOption = {
    field: keyof Product;
    direction: 'asc' | 'desc';
    label: string;
};

type SortDirection = 'asc' | 'desc';
type SortField = keyof Product | null;

const ProductTable: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [sortField, setSortField] = useState<SortField>('name');
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    // New states for enhanced filtering
    const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [sortOption, setSortOption] = useState<SortOption>({
        field: 'name',
        direction: 'asc',
        label: 'Nombre (A-Z)'
    });

    // Predefined sorting options
    const sortOptions: SortOption[] = [
        { field: 'name', direction: 'asc', label: 'Nombre (A-Z)' },
        { field: 'name', direction: 'desc', label: 'Nombre (Z-A)' },
        { field: 'price', direction: 'asc', label: 'Precio (menor a mayor)' },
        { field: 'price', direction: 'desc', label: 'Precio (mayor a menor)' },
        { field: 'created_at', direction: 'desc', label: 'Más recientes primero' },
        { field: 'created_at', direction: 'asc', label: 'Más antiguos primero' }
    ];

    // Delete confirmation modal state
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Fetch products and categories on component mount
    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    // Fetch categories for filter dropdown
    const fetchCategories = async () => {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name')
                .order('name', { ascending: true });

            if (error) throw error;
            setCategories(data || []);
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const fetchProducts = async () => {
        try {
            setLoading(true);

            // Modify the query to include the join with categories
            const { data, error } = await supabase
                .from('products')
                .select(`
                *,
                categories:category_id(id, name)
            `);

            if (error) throw error;

            // Transform data to include category name
            const formattedData = data.map(product => ({
                ...product,
                category_name: product.categories ? product.categories.name : 'Sin categoría'
            }));

            setProducts(formattedData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar productos');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle row selection
    const toggleProductSelection = (productId: number) => {
        setSelectedProductIds(prevSelected => {
            if (prevSelected.includes(productId)) {
                return prevSelected.filter(id => id !== productId);
            } else {
                return [...prevSelected, productId];
            }
        });
    };

    // Handle select all
    const toggleSelectAll = () => {
        if (selectedProductIds.length === getSortedAndFilteredProducts().length) {
            setSelectedProductIds([]);
        } else {
            setSelectedProductIds(getSortedAndFilteredProducts().map(product => product.id));
        }
    };

    // Show delete confirmation modal
    const handleShowDeleteModal = () => {
        if (selectedProductIds.length === 0) return;
        setIsDeleteModalOpen(true);
    };

    const handleDeleteConfirmed = async () => {
        try {
            setLoading(true);

            // 1. First retrieve the image paths of the products to delete
            const { data: imageData, error: imageError } = await supabase
                .from('product_images')
                .select('id, path')
                .in('product_id', selectedProductIds);

            if (imageError) throw imageError;

            // 2. Delete images from Supabase Storage
            if (imageData && imageData.length > 0) {
                // Get all image paths
                const imagePaths = imageData.map(img => img.path).filter(Boolean);

                // Delete images from storage in batches to avoid overload
                if (imagePaths.length > 0) {
                    // Process deletion in batches of 10 images
                    for (let i = 0; i < imagePaths.length; i += 10) {
                        const batch = imagePaths.slice(i, i + 10);
                        const { error: deleteStorageError } = await supabase.storage
                            .from(STORAGE_BUCKET)
                            .remove(batch);

                        if (deleteStorageError) {
                            console.error('Error deleting images:', deleteStorageError);
                        }
                    }
                }
            }

            // 3. Delete product_images entries
            const { error: deleteImagesError } = await supabase
                .from('product_images')
                .delete()
                .in('product_id', selectedProductIds);

            if (deleteImagesError) throw deleteImagesError;

            // 4. Finally delete the products
            const { error: deleteProductsError } = await supabase
                .from('products')
                .delete()
                .in('id', selectedProductIds);

            if (deleteProductsError) throw deleteProductsError;

            // Refresh product list
            fetchProducts();
            // Clear selection
            setSelectedProductIds([]);
            // Close the modal
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error('Error deleting products:', err);
            setError(err instanceof Error ? err.message : 'Error al eliminar productos');
        } finally {
            setLoading(false);
        }
    };

    // Edit a product
    const handleEditProduct = (product: Product) => {
        setEditingProduct(product);
    };

    // Close edit modal
    const handleCloseEditModal = () => {
        setEditingProduct(null);
    };

    // Handle successful edit
    const handleProductUpdated = () => {
        fetchProducts();
        setEditingProduct(null);
        // Clear selection state after successful edit
        setSelectedProductIds([]);
    };

    // Handle sorting when clicking table headers
    const handleSort = (field: keyof Product) => {
        if (sortField === field) {
            // Toggle direction if same field
            setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // New field, default to ascending
            setSortField(field);
            setSortDirection('asc');
        }

        // Also update sort option selector to match
        const newDirection = sortField === field && sortDirection === 'asc' ? 'desc' : 'asc';
        const matchingOption = sortOptions.find(
            opt => opt.field === field && opt.direction === (sortField === field ? newDirection : 'asc')
        );

        if (matchingOption) {
            setSortOption(matchingOption);
        }
    };

    // Handle sort option selection
    const handleSortOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const [field, direction] = e.target.value.split('-') as [keyof Product, 'asc' | 'desc'];
        const option = sortOptions.find(opt => opt.field === field && opt.direction === direction);

        if (option) {
            setSortOption(option);
            setSortField(option.field);
            setSortDirection(option.direction);
        }
    };

    // Apply sorting and filtering
    const getSortedAndFilteredProducts = () => {
        // First apply search and category filters
        let filteredProducts = products;

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filteredProducts = filteredProducts.filter(product =>
                product.name.toLowerCase().includes(term) ||
                (product.description?.toLowerCase().includes(term)) ||
                (product.sku?.toLowerCase().includes(term)) ||
                (product.dimensions?.toLowerCase().includes(term)) ||
                (product.material?.toLowerCase().includes(term))
            );
        }

        // Apply category filter
        if (selectedCategory !== null) {
            filteredProducts = filteredProducts.filter(product =>
                product.category_id === selectedCategory
            );
        }

        // Then apply sorting
        return [...filteredProducts].sort((a, b) => {
            const aValue = a[sortField || 'name'];
            const bValue = b[sortField || 'name'];

            // Handle undefined values
            if (aValue === undefined && bValue === undefined) return 0;
            if (aValue === undefined) return 1;
            if (bValue === undefined) return -1;

            // Compare according to sort direction
            if (aValue < bValue) {
                return sortDirection === 'asc' ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortDirection === 'asc' ? 1 : -1;
            }
            return 0;
        });
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Format price for display
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('es-MX', {
            style: 'currency',
            currency: 'MXN'
        }).format(price);
    };

    // Render sort indicator
    const renderSortIndicator = (field: keyof Product) => {
        if (sortField !== field) return null;

        return sortDirection === 'asc'
            ? <ChevronUp className="inline w-4 h-4" />
            : <ChevronDown className="inline w-4 h-4" />;
    };

    // Get display-friendly column names
    const getColumnName = (field: keyof Product): string => {
        const columnNames: Record<keyof Product, string> = {
            id: 'ID',
            created_at: 'Fecha de creación',
            category_id: 'ID Categoría',
            name: 'Nombre',
            description: 'Descripción',
            price: 'Precio',
            sku: 'SKU',
            category_name: 'Categoría',
            dimensions: 'Dimensiones',
            material: 'Material'
        };

        return columnNames[field] || String(field);
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex flex-col md:flex-row gap-4">
                {/* Filter and Search Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full md:w-auto md:flex-grow">
                    {/* Search Input */}
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* Category Filter */}
                    <div>
                        <select
                            value={selectedCategory !== null ? selectedCategory : ''}
                            onChange={(e) => setSelectedCategory(e.target.value ? Number(e.target.value) : null)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map(category => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <select
                            value={`${sortOption.field}-${sortOption.direction}`}
                            onChange={handleSortOptionChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                            {sortOptions.map((option, index) => (
                                <option key={index} value={`${option.field}-${option.direction}`}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                    {selectedProductIds.length === 1 && (
                        <button
                            onClick={() => handleEditProduct(products.find(p => p.id === selectedProductIds[0])!)}
                            className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            <Edit size={16} className="mr-1" /> Editar
                        </button>
                    )}

                    {selectedProductIds.length > 0 && (
                        <button
                            onClick={handleShowDeleteModal}
                            className="flex items-center bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                            <Trash2 size={16} className="mr-1" /> Eliminar ({selectedProductIds.length})
                        </button>
                    )}
                </div>
            </div>

            {/* Results Counter */}
            <div className="mb-4 text-sm text-gray-500">
                Mostrando {getSortedAndFilteredProducts().length} de {products.length} productos
            </div>

            {loading ? (
                <div className="w-full flex justify-center p-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <thead className="bg-gray-100">
                        <tr>
                            <th className="w-10 px-4 py-2 text-center">
                                <button onClick={toggleSelectAll} className="focus:outline-none">
                                    {selectedProductIds.length === getSortedAndFilteredProducts().length && getSortedAndFilteredProducts().length > 0 ? (
                                        <CheckSquare size={20} className="text-orange-500" />
                                    ) : (
                                        <Square size={20} className="text-gray-400" />
                                    )}
                                </button>
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('id')}>
                                {getColumnName('id')} {renderSortIndicator('id')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('name')}>
                                {getColumnName('name')} {renderSortIndicator('name')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('description')}>
                                {getColumnName('description')} {renderSortIndicator('description')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('price')}>
                                {getColumnName('price')} {renderSortIndicator('price')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('sku')}>
                                {getColumnName('sku')} {renderSortIndicator('sku')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('dimensions')}>
                                {getColumnName('dimensions')} {renderSortIndicator('dimensions')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('material')}>
                                {getColumnName('material')} {renderSortIndicator('material')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('category_name')}>
                                {getColumnName('category_name')} {renderSortIndicator('category_name')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('created_at')}>
                                {getColumnName('created_at')} {renderSortIndicator('created_at')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {getSortedAndFilteredProducts().length === 0 ? (
                            <tr>
                                <td colSpan={10} className="px-4 py-8 text-center text-gray-500">
                                    No se encontraron productos
                                </td>
                            </tr>
                        ) : (
                            getSortedAndFilteredProducts().map(product => (
                                <tr
                                    key={product.id}
                                    className={`border-t border-gray-200 hover:bg-gray-50 ${
                                        selectedProductIds.includes(product.id) ? 'bg-orange-50' : ''
                                    }`}
                                >
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => toggleProductSelection(product.id)}
                                            className="focus:outline-none"
                                        >
                                            {selectedProductIds.includes(product.id) ? (
                                                <CheckSquare size={20} className="text-orange-500" />
                                            ) : (
                                                <Square size={20} className="text-gray-400" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-center">{product.id}</td>
                                    <td className="px-4 py-2 font-medium text-center">{product.name}</td>
                                    <td className="px-4 py-2 max-w-xs truncate text-center">{product.description}</td>
                                    <td className="px-4 py-2 text-center">{formatPrice(product.price)}</td>
                                    <td className="px-4 py-2 text-center">{product.sku}</td>
                                    <td className="px-4 py-2 text-center">{product.dimensions || "-"}</td>
                                    <td className="px-4 py-2 text-center">{product.material || "-"}</td>
                                    <td className="px-4 py-2 text-center">{product.category_name}</td>
                                    <td className="px-4 py-2 text-center">{formatDate(product.created_at)}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {editingProduct && (
                <EditProductModal
                    product={editingProduct}
                    isOpen={!!editingProduct}
                    onClose={handleCloseEditModal}
                    onSuccess={handleProductUpdated}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirmed}
                itemCount={selectedProductIds.length}
                itemType="producto"
                confirmationText="EliminarProducto"
            />
        </div>
    );
};

export default ProductTable;