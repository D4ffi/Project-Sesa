import React, { useState, useEffect } from 'react';
import { Edit, Trash2, CheckSquare, Square, ChevronUp, ChevronDown, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient.ts';
import EditWarehouseModal from "./EditWareHouseModal.tsx";
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

// Warehouse type based on database schema (sin capacidad)
type Warehouse = {
    id: number;
    created_at: string;
    name: string;
    location: string;
    active: boolean;
    description?: string;
};

type SortDirection = 'asc' | 'desc';
type SortField = keyof Warehouse | null;

const WarehouseTable: React.FC = () => {
    const navigate = useNavigate();
    const [warehouses, setWarehouses] = useState<Warehouse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedWarehouseIds, setSelectedWarehouseIds] = useState<number[]>([]);
    const [editingWarehouse, setEditingWarehouse] = useState<Warehouse | null>(null);
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    // State for delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Fetch warehouses on component mount
    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('warehouses')
                .select('*');

            if (error) throw error;

            setWarehouses(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar bodegas');
            console.error('Error fetching warehouses:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle row selection
    const toggleWarehouseSelection = (warehouseId: number) => {
        setSelectedWarehouseIds(prevSelected => {
            if (prevSelected.includes(warehouseId)) {
                return prevSelected.filter(id => id !== warehouseId);
            } else {
                return [...prevSelected, warehouseId];
            }
        });
    };

    // Handle select all
    const toggleSelectAll = () => {
        if (selectedWarehouseIds.length === warehouses.length) {
            setSelectedWarehouseIds([]);
        } else {
            setSelectedWarehouseIds(warehouses.map(warehouse => warehouse.id));
        }
    };

    // Show delete confirmation modal
    const handleShowDeleteModal = () => {
        if (selectedWarehouseIds.length === 0) return;
        setIsDeleteModalOpen(true);
    };

    // Delete selected warehouses after confirmation
    const handleDeleteConfirmed = async () => {
        try {
            const { error } = await supabase
                .from('warehouses')
                .delete()
                .in('id', selectedWarehouseIds);

            if (error) throw error;

            // Refresh warehouse list
            fetchWarehouses();
            // Clear selection
            setSelectedWarehouseIds([]);
            // Close the modal
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error('Error deleting warehouses:', err);
            setError(err instanceof Error ? err.message : 'Error al eliminar bodegas');
        }
    };

    // Edit a warehouse
    const handleEditWarehouse = (warehouse: Warehouse) => {
        setEditingWarehouse(warehouse);
    };

    // Close edit modal
    const handleCloseEditModal = () => {
        setEditingWarehouse(null);
    };

    // Handle successful edit
    const handleWarehouseUpdated = () => {
        fetchWarehouses();
        setEditingWarehouse(null);
    };

    // Navigate to warehouse detail page
    const handleWarehouseClick = (warehouse: Warehouse) => {
        navigate(`/warehouse/${warehouse.id}`, { state: { warehouse } });
    };

    // Handle sorting
    const handleSort = (field: keyof Warehouse) => {
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
    const getSortedAndFilteredWarehouses = () => {
        // First apply search filter
        let filteredWarehouses = warehouses;

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filteredWarehouses = warehouses.filter(warehouse =>
                warehouse.name.toLowerCase().includes(term) ||
                warehouse.location.toLowerCase().includes(term) ||
                (warehouse.description && warehouse.description.toLowerCase().includes(term))
            );
        }

        // Then apply sorting
        if (sortField) {
            return [...filteredWarehouses].sort((a, b) => {
                if (sortField === 'active') {
                    // Special handling for boolean fields
                    return sortDirection === 'asc'
                        ? (a.active === b.active ? 0 : a.active ? -1 : 1)
                        : (a.active === b.active ? 0 : a.active ? 1 : -1);
                }

                if ((a[sortField] ?? '') < (b[sortField] ?? '')) {
                    return sortDirection === 'asc' ? -1 : 1;
                }
                if ((a[sortField] ?? '') > (b[sortField] ?? '')) {
                    return sortDirection === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredWarehouses;
    };

    // Format date for display
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    // Render sort indicator
    const renderSortIndicator = (field: keyof Warehouse) => {
        if (sortField !== field) return null;

        return sortDirection === 'asc'
            ? <ChevronUp className="inline w-4 h-4" />
            : <ChevronDown className="inline w-4 h-4" />;
    };

    // Get display-friendly column names
    const getColumnName = (field: keyof Warehouse): string => {
        const columnNames: Record<keyof Warehouse, string> = {
            id: 'ID',
            created_at: 'Fecha de creación',
            name: 'Nombre',
            location: 'Ubicación',
            active: 'Estado',
            description: 'Descripción',
        };

        return columnNames[field] || String(field);
    };

    return (
        <div className="w-full">
            <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Buscar bodegas..."
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex space-x-2">
                    {selectedWarehouseIds.length === 1 && (
                        <button
                            onClick={() => handleEditWarehouse(warehouses.find(w => w.id === selectedWarehouseIds[0])!)}
                            className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            <Edit size={16} className="mr-1" /> Editar
                        </button>
                    )}

                    {selectedWarehouseIds.length > 0 && (
                        <button
                            onClick={handleShowDeleteModal}
                            className="flex items-center bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                            <Trash2 size={16} className="mr-1" /> Eliminar ({selectedWarehouseIds.length})
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
                            <th className="w-10 px-4 py-2 text-center">
                                <button onClick={toggleSelectAll} className="focus:outline-none">
                                    {selectedWarehouseIds.length === warehouses.length && warehouses.length > 0 ? (
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
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('location')}>
                                {getColumnName('location')} {renderSortIndicator('location')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('active')}>
                                {getColumnName('active')} {renderSortIndicator('active')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('description')}>
                                {getColumnName('description')} {renderSortIndicator('description')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('created_at')}>
                                {getColumnName('created_at')} {renderSortIndicator('created_at')}
                            </th>
                            <th className="px-4 py-2 text-center">Detalles</th>
                        </tr>
                        </thead>
                        <tbody>
                        {getSortedAndFilteredWarehouses().length === 0 ? (
                            <tr>
                                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                                    No se encontraron bodegas
                                </td>
                            </tr>
                        ) : (
                            getSortedAndFilteredWarehouses().map(warehouse => (
                                <tr
                                    key={warehouse.id}
                                    className={`border-t border-gray-200 hover:bg-gray-50 ${
                                        selectedWarehouseIds.includes(warehouse.id) ? 'bg-orange-50' : ''
                                    } cursor-pointer`}
                                >
                                    <td className="px-4 py-2 text-center" onClick={(e) => e.stopPropagation()}>
                                        <button
                                            onClick={() => toggleWarehouseSelection(warehouse.id)}
                                            className="focus:outline-none"
                                        >
                                            {selectedWarehouseIds.includes(warehouse.id) ? (
                                                <CheckSquare size={20} className="text-orange-500" />
                                            ) : (
                                                <Square size={20} className="text-gray-400" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-center" onClick={() => handleWarehouseClick(warehouse)}>{warehouse.id}</td>
                                    <td className="px-4 py-2 font-medium text-center" onClick={() => handleWarehouseClick(warehouse)}>{warehouse.name}</td>
                                    <td className="px-4 py-2 text-center" onClick={() => handleWarehouseClick(warehouse)}>{warehouse.location}</td>
                                    <td className="px-4 py-2 text-center" onClick={() => handleWarehouseClick(warehouse)}>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        warehouse.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}>
                        {warehouse.active ? 'Activa' : 'Inactiva'}
                    </span>
                                    </td>
                                    <td className="px-4 py-2 max-w-xs truncate text-center" onClick={() => handleWarehouseClick(warehouse)}>{warehouse.description || "-"}</td>
                                    <td className="px-4 py-2 text-center" onClick={() => handleWarehouseClick(warehouse)}>{formatDate(warehouse.created_at)}</td>
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => handleWarehouseClick(warehouse)}
                                            className="p-1 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded"
                                            title="Ver detalles"
                                        >
                                            <ExternalLink size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {editingWarehouse && (
                <EditWarehouseModal
                    warehouse={editingWarehouse}
                    isOpen={!!editingWarehouse}
                    onClose={handleCloseEditModal}
                    onSuccess={handleWarehouseUpdated}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirmed}
                itemCount={selectedWarehouseIds.length}
                itemType="bodega"
                confirmationText="EliminarBodega"
            />
        </div>
    );
};

export default WarehouseTable;