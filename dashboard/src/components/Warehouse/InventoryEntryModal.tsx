// dashboard/src/components/Warehouse/InventoryEntryModal.tsx
import React, { useState, useEffect } from 'react';
import { X, Package } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

// Tipos
type InventoryItem = {
    id: number;
    warehouse_id: number;
    product_id: number;
    stock: number;
    min_stock_level: number;
    max_stock_level: number | null;
    last_updated: string;
    product_name?: string;
    product_sku?: string;
};

type Product = {
    id: number;
    name: string;
    sku: string;
};

interface InventoryEntryModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    warehouseId: number;
    warehouseName: string;
    selectedItem?: InventoryItem | null; // Para preseleccionar un producto
}

const InventoryEntryModal: React.FC<InventoryEntryModalProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     onSuccess,
                                                                     warehouseId,
                                                                     warehouseName,
                                                                     selectedItem = null
                                                                 }) => {
    // Estados para el formulario
    const [quantity, setQuantity] = useState<number>(1);
    const [productId, setProductId] = useState<number | string>('');
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);

    // Cargar productos cuando se abre el modal
    useEffect(() => {
        if (isOpen) {
            fetchProducts();
            fetchInventoryItems();

            // Si hay un producto seleccionado, establecerlo
            if (selectedItem) {
                setProductId(selectedItem.product_id);
            } else {
                setProductId('');
            }

            setQuantity(1);
            setError(null);
        }
    }, [isOpen, selectedItem]);

    // Obtener productos disponibles
    const fetchProducts = async () => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('id, name, sku')
                .order('name', { ascending: true });

            if (error) throw error;
            setProducts(data || []);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError('Error al cargar productos');
        }
    };

    // Obtener elementos de inventario existentes para este almacén
    const fetchInventoryItems = async () => {
        try {
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
                    products:product_id (name, sku)
                `)
                .eq('warehouse_id', warehouseId);

            if (error) throw error;

            // Transformar datos para incluir nombre y sku del producto
            const formattedItems = data?.map(item => ({
                ...item,
                product_name: item.products?.name || 'Producto desconocido',
                product_sku: item.products?.sku || 'N/A'
            })) || [];

            setInventoryItems(formattedItems);
        } catch (err) {
            console.error('Error fetching inventory items:', err);
        }
    };

    // Validar formulario
    const validateForm = () => {
        if (!productId) {
            setError('Debe seleccionar un producto');
            return false;
        }

        if (!quantity || quantity <= 0) {
            setError('La cantidad debe ser mayor que cero');
            return false;
        }

        return true;
    };

    // Manejar envío del formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Buscar si el producto ya existe en el inventario
            const existingItem = inventoryItems.find(item => item.product_id === Number(productId));

            if (existingItem) {
                // Actualizar inventario existente
                const { error } = await supabase
                    .from('warehouse-detail')
                    .update({
                        stock: existingItem.stock + quantity,
                        last_updated: new Date().toISOString()
                    })
                    .eq('id', existingItem.id);

                if (error) throw error;
            } else {
                // Crear nuevo registro de inventario
                const { error } = await supabase
                    .from('warehouse-detail')
                    .insert({
                        warehouse_id: warehouseId,
                        product_id: productId,
                        stock: quantity,
                        min_stock_level: 0, // Valor predeterminado
                        last_updated: new Date().toISOString()
                    });

                if (error) throw error;
            }

            // Notificar éxito y cerrar
            onSuccess();
            onClose();
        } catch (err) {
            console.error('Error updating inventory:', err);
            setError(err instanceof Error ? err.message : 'Error al actualizar inventario');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Entrada de Productos</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-5">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="mb-3">
                        <p className="text-sm text-gray-600">
                            Registrar entrada de productos al almacén: <strong>{warehouseName}</strong>
                        </p>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Producto <span className="text-red-500">*</span>
                        </label>
                        <select
                            value={productId}
                            onChange={(e) => setProductId(Number(e.target.value))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        >
                            <option value="">Seleccionar producto</option>
                            {products.map(product => (
                                <option key={product.id} value={product.id}>
                                    {product.name} - {product.sku}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-medium mb-2">
                            Cantidad <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 0))}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Procesando...
                                </>
                            ) : (
                                <>
                                    <Package size={16} className="mr-1" />
                                    Registrar Entrada
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InventoryEntryModal;