// dashboard/src/components/Warehouse/WarehouseInventoryTable.tsx
import React, { useState, useEffect } from 'react';
import { Edit, Trash2, CheckSquare, Square, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient.ts';
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

// Types
type InventoryItem = {
    id: number;
    warehouse_id: number;
    product_id: number;
    stock: number;
    min_stock_level: number;
    max_stock_level: number | null;
    last_updated: string;
    // Joined fields
    product_name?: string;
    product_sku?: string;
    category_name?: string;
    products?: {
        id: number;
        name: string;
        sku: string;
        categories?: {
            name: string;
        };
    };
};

type SortDirection = 'asc' | 'desc';
type SortField = keyof InventoryItem | null;

interface WarehouseInventoryTableProps {
    warehouseId: number;
    onEdit: (item: InventoryItem) => void;
}

const WarehouseInventoryTable: React.FC<WarehouseInventoryTableProps> = ({ warehouseId, onEdit }) => {
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedItemIds, setSelectedItemIds] = useState<number[]>([]);
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [searchTerm, setSearchTerm] = useState('');
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    useEffect(() => {
        fetchInventory();
    }, [warehouseId]);

    const fetchInventory = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log(`Fetching inventory for warehouse ID: ${warehouseId}`);

            // Join with products to get product details
            const { data, error } = await supabase
                .from('warehouse-detail')
                .select(`
                    id,
                    warehouse_id,
                    product_id,
                    stock,
                    min_stock_level,
                    max_stock_level,
                    last_updated,
                    products:product_id (
                        id,
                        name, 
                        sku,
                        category_id,
                        categories:category_id (
                            id,
                            name
                        )
                    )
                `)
                .eq('warehouse_id', warehouseId);

            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }

            console.log('Inventory data fetched:', data?.length, 'items');
            if (data && data.length > 0) {
                console.log('Sample inventory item:', data[0]);
            }

            // Transform data to include joined fields at the top level
            const formattedItems = data?.map(item => {
                // Ensure products exists before trying to access properties
                const productName = item.products?.name || 'Producto desconocido';
                const productSku = item.products?.sku || 'N/A';
                // Handle potentially nested category data
                let categoryName = 'Sin categoría';
                if (item.products?.categories) {
                    categoryName = item.products.categories.name || 'Sin categoría';
                }

                return {
                    ...item,
                    product_name: productName,
                    product_sku: productSku,
                    category_name: categoryName
                };
            }) || [];

            setInventoryItems(formattedItems);
        } catch (err) {
            console.error('Error fetching inventory:', err);
            setError(err instanceof Error ? err.message : 'Error al cargar el inventario');
        } finally {
            setLoading(false);
        }
    };

    // Handle row selection
    const toggleItemSelection = (itemId: number) => {
        setSelectedItemIds(prevSelected => {
            if (prevSelected.includes(itemId)) {
                return prevSelected.filter(id => id !== itemId);
            } else {
                return [...prevSelected, itemId];
            }
        });
    };

    // Handle select all
    const toggleSelectAll = () => {
        if (selectedItemIds.length === inventoryItems.length) {
            setSelectedItemIds([]);
        } else {
            setSelectedItemIds(inventoryItems.map(item => item.id));
        }
    };

    // Show delete confirmation modal
    const handleShowDeleteModal = () => {
        if (selectedItemIds.length === 0) return;
        setIsDeleteModalOpen(true);
    };

    // Delete selected items after confirmation
    const handleDeleteConfirmed = async () => {
        try {
            console.log('Deleting inventory items:', selectedItemIds);

            const { error } = await supabase
                .from('warehouse-detail')
                .delete()
                .in('id', selectedItemIds);

            if (error) throw error;

            // Refresh inventory list
            fetchInventory();
            // Clear selection
            setSelectedItemIds([]);
            // Close the modal
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error('Error deleting inventory items:', err);
            setError(err instanceof Error ? err.message : 'Error al eliminar elementos del inventario');
        }
    };

    // Edit an inventory item
    const handleEditItem = (item: InventoryItem) => {
        onEdit(item);
    };

    // Handle sorting
    const handleSort = (field: keyof InventoryItem) => {
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
    const getSortedAndFilteredItems = () => {
        // First apply search filter
        let filteredItems = inventoryItems;

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filteredItems = inventoryItems.filter(item =>
                (item.product_name?.toLowerCase().includes(term)) ||
                (item.product_sku?.toLowerCase().includes(term)) ||
                (item.category_name?.toLowerCase().includes(term))
            );
        }

        // Then apply sorting
        if (sortField) {
            return [...filteredItems].sort((a, b) => {
                // Handle different types of fields appropriately
                const valueA = a[sortField] !== undefined ? a[sortField] : '';
                const valueB = b[sortField] !== undefined ? b[sortField] : '';

                if (valueA < valueB) {
                    return sortDirection === 'asc' ? -1 : 1;
                }
                if (valueA > valueB) {
                    return sortDirection === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredItems;
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Render sort indicator
    const renderSortIndicator = (field: keyof InventoryItem) => {
        if (sortField !== field) return null;

        return sortDirection === 'asc'
            ? <ChevronUp className="inline w-4 h-4" />
            : <ChevronDown className="inline w-4 h-4" />;
    };

    // Check if stock is low (below min_stock_level)
    const isStockLow = (item: InventoryItem) => {
        return item.stock < item.min_stock_level;
    };

    // Check if stock is high (above max_stock_level, if set)
    const isStockHigh = (item: InventoryItem) => {
        return item.max_stock_level !== null && item.stock > item.max_stock_level;
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Buscar en inventario..."
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex space-x-2">
                    {selectedItemIds.length === 1 && (
                        <button
                            onClick={() => handleEditItem(inventoryItems.find(item => item.id === selectedItemIds[0])!)}
                            className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            <Edit size={16} className="mr-1" /> Editar
                        </button>
                    )}

                    {selectedItemIds.length > 0 && (
                        <button
                            onClick={handleShowDeleteModal}
                            className="flex items-center bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                            <Trash2 size={16} className="mr-1" /> Eliminar ({selectedItemIds.length})
                        </button>
                    )}
                </div>
            </div>

            {loading ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <div className="flex justify-center items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500 mr-2"></div>
                        <span>Cargando inventario...</span>
                    </div>
                </div>
            ) : error ? (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            ) : (
                <>
                    {inventoryItems.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-md p-8 text-center">
                            <div className="flex flex-col items-center justify-center text-gray-500">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                </svg>
                                <p>No hay productos en el inventario de esta bodega</p>
                                <p className="text-sm mt-2">Utiliza el botón "Agregar producto" para comenzar a construir tu inventario</p>
                            </div>
                        </div>
                    ) : (
                        <div className="overflow-x-auto bg-white rounded-lg shadow-md">
                            <table className="min-w-full">
                                <thead className="bg-gray-100">
                                <tr>
                                    <th className="w-10 px-4 py-2">
                                        <button onClick={toggleSelectAll} className="focus:outline-none">
                                            {selectedItemIds.length === inventoryItems.length && inventoryItems.length > 0 ? (
                                                <CheckSquare size={20} className="text-orange-500" />
                                            ) : (
                                                <Square size={20} className="text-gray-400" />
                                            )}
                                        </button>
                                    </th>
                                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('product_name')}>
                                        Producto {renderSortIndicator('product_name')}
                                    </th>
                                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('product_sku')}>
                                        SKU {renderSortIndicator('product_sku')}
                                    </th>
                                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('category_name')}>
                                        Categoría {renderSortIndicator('category_name')}
                                    </th>
                                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('stock')}>
                                        Stock {renderSortIndicator('stock')}
                                    </th>
                                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('min_stock_level')}>
                                        Mín {renderSortIndicator('min_stock_level')}
                                    </th>
                                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('max_stock_level')}>
                                        Máx {renderSortIndicator('max_stock_level')}
                                    </th>
                                    <th className="px-4 py-2 cursor-pointer" onClick={() => handleSort('last_updated')}>
                                        Actualizado {renderSortIndicator('last_updated')}
                                    </th>
                                    <th className="px-4 py-2">Estado</th>
                                </tr>
                                </thead>
                                <tbody>
                                {getSortedAndFilteredItems().map(item => (
                                    <tr
                                        key={item.id}
                                        className={`border-t border-gray-200 hover:bg-gray-50 ${
                                            selectedItemIds.includes(item.id) ? 'bg-orange-50' : ''
                                        }`}
                                    >
                                        <td className="px-4 py-2 text-center">
                                            <button
                                                onClick={() => toggleItemSelection(item.id)}
                                                className="focus:outline-none"
                                            >
                                                {selectedItemIds.includes(item.id) ? (
                                                    <CheckSquare size={20} className="text-orange-500" />
                                                ) : (
                                                    <Square size={20} className="text-gray-400" />
                                                )}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2 font-medium">{item.product_name}</td>
                                        <td className="px-4 py-2">{item.product_sku}</td>
                                        <td className="px-4 py-2">{item.category_name}</td>
                                        <td className="px-4 py-2">
                                                <span className={`${
                                                    isStockLow(item)
                                                        ? 'text-red-600 font-medium'
                                                        : isStockHigh(item)
                                                            ? 'text-yellow-600 font-medium'
                                                            : ''
                                                }`}>
                                                    {item.stock}
                                                </span>
                                        </td>
                                        <td className="px-4 py-2">{item.min_stock_level}</td>
                                        <td className="px-4 py-2">{item.max_stock_level !== null ? item.max_stock_level : '-'}</td>
                                        <td className="px-4 py-2 text-sm">{formatDate(item.last_updated)}</td>
                                        <td className="px-4 py-2">
                                            {isStockLow(item) && (
                                                <div className="flex items-center text-red-600">
                                                    <AlertTriangle size={16} className="mr-1" /> Bajo stock
                                                </div>
                                            )}
                                            {isStockHigh(item) && (
                                                <div className="flex items-center text-yellow-600">
                                                    <AlertTriangle size={16} className="mr-1" /> Exceso
                                                </div>
                                            )}
                                            {!isStockLow(item) && !isStockHigh(item) && (
                                                <span className="text-green-600">OK</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirmed}
                itemCount={selectedItemIds.length}
                itemType="inventario"
                confirmationText="EliminarInventario"
            />
        </div>
    );
};

export default WarehouseInventoryTable;