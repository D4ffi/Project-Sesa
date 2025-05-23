// dashboard/src/components/Warehouse/EditInventoryModal.tsx
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

// Type for the inventory item
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
};

interface EditInventoryModalProps {
    item: InventoryItem;
    warehouseName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EditInventoryModal: React.FC<EditInventoryModalProps> = ({
                                                                   item,
                                                                   warehouseName,
                                                                   isOpen,
                                                                   onClose,
                                                                   onSuccess
                                                               }) => {
    // Form state - initialize with values from the item (usando string para max_stock_level si es null)
    const [formData, setFormData] = useState({
        stock: item.stock,
        min_stock_level: item.min_stock_level,
        max_stock_level: item.max_stock_level === null ? '' : item.max_stock_level,
    });

    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            // Manejo seguro para valores numéricos
            if (value === '') {
                // Si está vacío, configurar como string vacío (para max_stock_level) o 0 para los demás
                if (name === 'max_stock_level') {
                    setFormData(prev => ({ ...prev, [name]: '' }));
                } else {
                    setFormData(prev => ({ ...prev, [name]: 0 }));
                }
            } else {
                // Asegurarse de que es un número válido
                const numValue = parseFloat(value);
                if (!isNaN(numValue)) {
                    setFormData(prev => ({ ...prev, [name]: numValue }));
                }
            }
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = () => {
        // Convertir a número para validación
        const stockQty = Number(formData.stock);
        const minLevel = Number(formData.min_stock_level);
        const maxLevel = formData.max_stock_level === '' ? null : Number(formData.max_stock_level);

        if (isNaN(stockQty) || stockQty < 0) {
            setError('La cantidad de stock no puede ser negativa');
            return false;
        }

        if (isNaN(minLevel) || minLevel < 0) {
            setError('El nivel mínimo de stock no puede ser negativo');
            return false;
        }

        if (maxLevel !== null && (isNaN(maxLevel) || maxLevel < minLevel)) {
            setError('El nivel máximo de stock debe ser mayor que el nivel mínimo');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Preparar datos para actualizar
            const updateData = {
                stock: Number(formData.stock),
                min_stock_level: Number(formData.min_stock_level),
                max_stock_level: formData.max_stock_level === '' ? null : Number(formData.max_stock_level),
                last_updated: new Date().toISOString()
            };

            console.log('Actualizando datos de inventario:', updateData);

            const { error: updateError } = await supabase
                .from('warehouse-detail')
                .update(updateData)
                .eq('id', item.id);

            if (updateError) throw updateError;

            // Notify parent and close modal
            onSuccess();
            onClose();

        } catch (err) {
            console.error('Error updating inventory item:', err);
            setError(err instanceof Error ? err.message : 'Error al actualizar elemento del inventario');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Editar Elemento de Inventario</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                            Editando: <span className="font-semibold">{item.product_name}</span> en bodega <span className="font-semibold">{warehouseName}</span>
                        </p>
                        <p className="text-xs text-gray-500">
                            SKU: {item.product_sku} | Categoría: {item.category_name}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Cantidad en Stock
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formData.stock}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Nivel Mínimo de Stock
                            </label>
                            <input
                                type="number"
                                name="min_stock_level"
                                value={formData.min_stock_level}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <p className="text-xs text-gray-500 mt-1">Nivel que dispara alertas de reabastecimiento</p>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Nivel Máximo de Stock
                            </label>
                            <input
                                type="number"
                                name="max_stock_level"
                                value={formData.max_stock_level}
                                onChange={handleInputChange}
                                min="0"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                placeholder="Opcional"
                            />
                            <p className="text-xs text-gray-500 mt-1">Capacidad máxima recomendada (opcional)</p>
                        </div>
                    </div>

                    <div className="mt-8 border-t pt-6 flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors flex items-center"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Guardando...
                                </>
                            ) : (
                                'Guardar Cambios'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInventoryModal;