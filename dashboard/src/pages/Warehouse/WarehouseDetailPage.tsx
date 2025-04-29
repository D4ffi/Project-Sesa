// dashboard/src/pages/Warehouse/WarehouseDetailPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Edit, AlertTriangle, Plus } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import Layout from "../../components/common/Layout.tsx";
import EditWarehouseModal from "../../components/Warehouse/EditWareHouseModal.tsx";
import CRUDButton from "../../components/Productos/CrudButton.tsx";
import AddInventoryModal from "../../components/Warehouse/AddInventoryModal.tsx";
import WarehouseInventoryTable from "../../components/Warehouse/WarehouseInventoryTable.tsx";
import EditInventoryModal from "../../components/Warehouse/EditInventoryModal.tsx";

// Tipo de bodega sin el campo capacity
type Warehouse = {
    id: number;
    created_at: string;
    name: string;
    location: string;
    active: boolean;
    description?: string;
};

// Tipo para el elemento de inventario
type InventoryItem = {
    id: number;
    warehouse_id: number;
    product_id: number;
    stock_quantity: number;
    min_stock_level: number;
    max_stock_level: number | null;
    last_updated: string;
    // Joined fields
    product_name?: string;
    product_sku?: string;
    category_name?: string;
};

const WarehouseDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const location = useLocation();

    // Si la bodega viene en el state de la navegación, úsala como estado inicial
    const initialWarehouse = location.state?.warehouse as Warehouse | undefined;

    const [warehouse, setWarehouse] = useState<Warehouse | null>(initialWarehouse || null);
    const [loading, setLoading] = useState(!initialWarehouse);
    const [error, setError] = useState<string | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Estados para el inventario
    const [isAddInventoryModalOpen, setIsAddInventoryModalOpen] = useState(false);
    const [editingInventoryItem, setEditingInventoryItem] = useState<InventoryItem | null>(null);
    const [inventoryRefreshTrigger, setInventoryRefreshTrigger] = useState(0);

    // Obtener los datos de la bodega si no están en el estado de navegación
    useEffect(() => {
        if (!initialWarehouse && id) {
            fetchWarehouseData();
        }
    }, [id, initialWarehouse]);

    const fetchWarehouseData = async () => {
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase
                .from('warehouses')
                .select('*')
                .eq('id', id)
                .single();

            if (error) throw error;
            if (!data) throw new Error('No se encontró la bodega');

            setWarehouse(data);
        } catch (err) {
            console.error('Error fetching warehouse:', err);
            setError(err instanceof Error ? err.message : 'Error al cargar la información de la bodega');
        } finally {
            setLoading(false);
        }
    };

    const handleEditSuccess = () => {
        fetchWarehouseData();
        setIsEditModalOpen(false);
    };

    // Formatear fecha para mostrar
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-MX', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Layout title="Detalle de Bodega">
                <div className="container mx-auto py-6 px-4">
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                    </div>
                </div>
            </Layout>
        );
    }

    if (error || !warehouse) {
        return (
            <Layout title="Error">
                <div className="container mx-auto py-6 px-4">
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4" role="alert">
                        <div className="flex items-center">
                            <AlertTriangle className="mr-2" />
                            <p className="font-bold">Error</p>
                        </div>
                        <p>{error || 'No se pudo cargar la información de la bodega'}</p>
                    </div>
                    <button
                        onClick={() => navigate('/warehouse')}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Volver a la lista de bodegas
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout title={`Bodega: ${warehouse.name}`}>
            <div className="container mx-auto py-6 px-4">
                <div className="mb-6 flex items-center justify-between">
                    <button
                        onClick={() => navigate('/warehouse')}
                        className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
                    >
                        <ArrowLeft size={16} className="mr-1" /> Volver a bodegas
                    </button>

                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    >
                        <Edit size={16} className="mr-2" /> Editar
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">{warehouse.name}</h1>
                            <span className={`px-3 py-1 rounded-full text-sm font-bold ${
                                warehouse.active
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                            }`}>
                                {warehouse.active ? 'Activa' : 'Inactiva'}
                            </span>
                        </div>
                    </div>

                    <div className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h2 className="text-lg font-semibold text-gray-700 mb-3">Información General</h2>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">ID</p>
                                        <p className="text-gray-800">{warehouse.id}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Nombre</p>
                                        <p className="text-gray-800">{warehouse.name}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Ubicación</p>
                                        <p className="text-gray-800">{warehouse.location}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Estado</p>
                                        <p className="text-gray-800">{warehouse.active ? 'Activa' : 'Inactiva'}</p>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h2 className="text-lg font-semibold text-gray-700 mb-3">Detalles</h2>

                                <div className="space-y-4">
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Descripción</p>
                                        <p className="text-gray-800">{warehouse.description || "Sin descripción"}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Fecha de creación</p>
                                        <p className="text-gray-800">{formatDate(warehouse.created_at)}</p>
                                    </div>

                                    {/* Aquí puedes agregar información adicional como inventario */}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sección para el inventario de la bodega */}
                    <div className="p-6 border-t border-gray-200">
                        <div className="flex justify-between items-center mb-3">
                            <h2 className="text-lg font-semibold text-gray-700">Inventario</h2>
                            <CRUDButton
                                icon={Plus}
                                label="Agregar producto al inventario"
                                tooltip="Agregar producto al inventario"
                                onClick={() => setIsAddInventoryModalOpen(true)}
                            />
                        </div>
                        <WarehouseInventoryTable
                            key={inventoryRefreshTrigger}
                            warehouseId={warehouse.id}
                            onEdit={item => setEditingInventoryItem(item)}
                        />
                    </div>
                </div>
            </div>

            {/* Modal de Edición de Bodega */}
            {isEditModalOpen && (
                <EditWarehouseModal
                    warehouse={warehouse}
                    isOpen={isEditModalOpen}
                    onClose={() => setIsEditModalOpen(false)}
                    onSuccess={handleEditSuccess}
                />
            )}

            {/* Modal de Agregar Inventario */}
            {isAddInventoryModalOpen && (
                <AddInventoryModal
                    warehouseId={warehouse.id}
                    warehouseName={warehouse.name}
                    isOpen={isAddInventoryModalOpen}
                    onClose={() => setIsAddInventoryModalOpen(false)}
                    onSuccess={() => {
                        setInventoryRefreshTrigger(prev => prev + 1);
                        setIsAddInventoryModalOpen(false);
                    }}
                />
            )}

            {/* Modal de Edición de Inventario */}
            {editingInventoryItem && (
                <EditInventoryModal
                    item={editingInventoryItem}
                    warehouseName={warehouse.name}
                    isOpen={!!editingInventoryItem}
                    onClose={() => setEditingInventoryItem(null)}
                    onSuccess={() => {
                        setInventoryRefreshTrigger(prev => prev + 1);
                        setEditingInventoryItem(null);
                    }}
                />
            )}
        </Layout>
    );
};

export default WarehouseDetailPage;