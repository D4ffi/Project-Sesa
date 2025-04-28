import React, { useState, useEffect } from 'react';
import { Edit, Trash2, CheckSquare, Square, ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient.ts';
import EditProductModal from "./EditModal.tsx";
import DeleteConfirmationModal from '../common/DeleteConfirmationModal'; // Import the new component

// Product type based on your database schema
type Product = {
    id: number;
    created_at: string;
    category_id: number;
    name: string;
    description: string;
    price: number;
    sku: string;
    category_name?: string; // For display purposes, joined from categories table
};

type SortDirection = 'asc' | 'desc';
type SortField = keyof Product | null;

const ProductTable: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedProductIds, setSelectedProductIds] = useState<number[]>([]);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    // New state for delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Fetch products on component mount
    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);

            // Modificar la consulta para incluir el join con categorías
            const { data, error } = await supabase
                .from('products')
                .select(`
                *,
                categories:category_id(id, name)
            `);

            if (error) throw error;

            // Transformar los datos para incluir el nombre de la categoría
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
        if (selectedProductIds.length === products.length) {
            setSelectedProductIds([]);
        } else {
            setSelectedProductIds(products.map(product => product.id));
        }
    };

    // Show delete confirmation modal
    const handleShowDeleteModal = () => {
        if (selectedProductIds.length === 0) return;
        setIsDeleteModalOpen(true);
    };

    // Delete selected products after confirmation
    const handleDeleteConfirmed = async () => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .in('id', selectedProductIds);

            if (error) throw error;

            // Refresh product list
            fetchProducts();
            // Clear selection
            setSelectedProductIds([]);
            // Close the modal
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error('Error deleting products:', err);
            setError(err instanceof Error ? err.message : 'Error al eliminar productos');
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
    };

    // Handle sorting
    const handleSort = (field: keyof Product) => {
        if (sortField === field) {
            // Toggle direction if same field
            setSortDirection(prevDirection => prevDirection === 'asc' ? 'desc' : 'asc');
        } else {
            // New field, default to ascending
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Apply sorting and filtering
    const getSortedAndFilteredProducts = () => {
        // First apply search filter
        let filteredProducts = products;

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filteredProducts = products.filter(product =>
                product.name.toLowerCase().includes(term) ||
                product.description.toLowerCase().includes(term) ||
                product.sku.toLowerCase().includes(term)
            );
        }

        // Then apply sorting
        if (sortField) {
            return [...filteredProducts].sort((a, b) => {
                if (sortField && a[sortField] !== undefined && b[sortField] !== undefined) {
                    if (a[sortField] < b[sortField]) {
                        return sortDirection === 'asc' ? -1 : 1;
                    }
                    if (a[sortField] > b[sortField]) {
                        return sortDirection === 'asc' ? 1 : -1;
                    }
                }
                return 0;
            });
        }

        return filteredProducts;
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
            category_name: 'Categoría'
        };

        return columnNames[field] || String(field);
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Buscar productos..."
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

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
                            <th className="w-10 px-4 py-2">
                                <button onClick={toggleSelectAll} className="focus:outline-none">
                                    {selectedProductIds.length === products.length && products.length > 0 ? (
                                        <CheckSquare size={20} className="text-orange-500" />
                                    ) : (
                                        <Square size={20} className="text-gray-400" />
                                    )}
                                </button>
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('id')}>
                                {getColumnName('id')} {renderSortIndicator('id')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('name')}>
                                {getColumnName('name')} {renderSortIndicator('name')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('description')}>
                                {getColumnName('description')} {renderSortIndicator('description')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('price')}>
                                {getColumnName('price')} {renderSortIndicator('price')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('sku')}>
                                {getColumnName('sku')} {renderSortIndicator('sku')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('category_name')}>
                                {getColumnName('category_name')} {renderSortIndicator('category_name')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('created_at')}>
                                {getColumnName('created_at')} {renderSortIndicator('created_at')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {getSortedAndFilteredProducts().length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
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
                                    <td className="px-4 py-2">{product.id}</td>
                                    <td className="px-4 py-2 font-medium">{product.name}</td>
                                    <td className="px-4 py-2 max-w-xs truncate">{product.description}</td>
                                    <td className="px-4 py-2">{formatPrice(product.price)}</td>
                                    <td className="px-4 py-2">{product.sku}</td>
                                    <td className="px-4 py-2">{product.category_name}</td>
                                    <td className="px-4 py-2">{formatDate(product.created_at)}</td>
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