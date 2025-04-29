// dashboard/src/components/Warehouse/AddInventoryModal.tsx
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

// Product type (basado en el modelo utilizado en AddModal.tsx)
type Product = {
    id: number;
    name: string;
    sku: string;
    price: number;
    category_id?: number;
    categories?: {
        id: number;
        name: string;
    } | { id: number; name: string; }[];
};

interface AddInventoryModalProps {
    warehouseId: number;
    warehouseName: string;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const AddInventoryModal: React.FC<AddInventoryModalProps> = ({
                                                                 warehouseId,
                                                                 warehouseName,
                                                                 isOpen,
                                                                 onClose,
                                                                 onSuccess
                                                             }) => {
    // Form state - Initialize with empty string instead of null to avoid controlled/uncontrolled warning
    const [formData, setFormData] = useState({
        product_id: '',
        stock: 0,
        min_stock_level: 0,
        max_stock_level: '', // Cambiado a string vacío en lugar de null
    });

    // Loading and error states
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Products for dropdown
    const [products, setProducts] = useState<Product[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(true);

    // Fetch products on component mount
    useEffect(() => {
        if (isOpen) {
            fetchProducts();
        }
    }, [isOpen]);

    const fetchProducts = async () => {
        try {
            setLoadingProducts(true);
            setError(null);

            // Usando la misma estructura de consulta que en otros componentes
            const { data, error } = await supabase
                .from('products')
                .select(`
                    id, 
                    name, 
                    sku, 
                    price,
                    category_id,
                    categories(id, name)
                `)
                .order('name', { ascending: true });

            if (error) throw error;

            // Debugging - ayuda a ver exactamente qué estructura devuelve
            console.log('Datos de productos:', data?.length);
            if (data && data.length > 0) {
                console.log('Primer producto muestra:', {
                    id: data[0].id,
                    name: data[0].name,
                    category: data[0].categories
                });
            }

            setProducts((data || []) as Product[]);
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err instanceof Error ? err.message : 'Error al cargar productos');
        } finally {
            setLoadingProducts(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'number') {
            // Manejo mejorado para evitar valores undefined o NaN
            if (value === '') {
                // Si está vacío, configuramos como string vacío para todos los campos
                setFormData(prev => ({ ...prev, [name]: '' }));
            } else {
                // Asegurarnos de que es un número válido
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
        if (!formData.product_id) {
            setError('Debe seleccionar un producto');
            return false;
        }

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
            const productId = parseInt(formData.product_id, 10);

            // Check if this product already exists in this warehouse's inventory
            const { data: existingItems, error: checkError } = await supabase
                .from('warehouse-detail')
                .select('id')
                .eq('warehouse_id', warehouseId)
                .eq('product_id', productId);

            if (checkError) throw checkError;

            if (existingItems && existingItems.length > 0) {
                throw new Error('Este producto ya existe en el inventario de esta bodega. Por favor edite el registro existente.');
            }

            // Preparar datos para insertar con tipos adecuados
            const insertData = {
                warehouse_id: warehouseId,
                product_id: productId,
                stock: Number(formData.stock),
                min_stock_level: Number(formData.min_stock_level),
                max_stock_level: formData.max_stock_level === '' ? null : Number(formData.max_stock_level),
                last_updated: new Date().toISOString()
            };

            console.log('Datos a insertar:', insertData);

            // Insert new inventory record
            const { error: insertError } = await supabase
                .from('warehouse-detail')
                .insert(insertData);

            if (insertError) throw insertError;

            // Reset form
            setFormData({
                product_id: '',
                stock: 0,
                min_stock_level: 0,
                max_stock_level: '',
            });

            // Notify parent and close modal
            onSuccess();
            onClose();

        } catch (err) {
            console.error('Error adding inventory item:', err);
            setError(err instanceof Error ? err.message : 'Error al agregar elemento al inventario');
        } finally {
            setLoading(false);
        }
    };

    // Función para obtener el nombre de la categoría de un producto de forma segura
    const getCategoryName = (product: Product): string => {
        try {
            if (!product) return 'Sin categoría';

            // Diferentes formas de acceder a la categoría dependiendo de la estructura
            if (product.categories) {
                if (Array.isArray(product.categories)) {
                    return product.categories[0]?.name || 'Sin categoría';
                } else {
                    return product.categories.name || 'Sin categoría';
                }
            }
            return 'Sin categoría';
        } catch (err) {
            console.error('Error al obtener nombre de categoría:', err);
            return 'Sin categoría';
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-lg max-h-[90vh] overflow-auto">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-xl font-bold text-gray-800">Agregar Producto al Inventario</h2>
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
                            Agregando producto a bodega: <span className="font-semibold">{warehouseName}</span>
                        </p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Producto <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="product_id"
                                value={formData.product_id}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                                disabled={loadingProducts}
                            >
                                <option value="">Seleccionar producto</option>
                                {loadingProducts ? (
                                    <option disabled>Cargando productos...</option>
                                ) : products.length === 0 ? (
                                    <option disabled>No hay productos disponibles</option>
                                ) : (
                                    products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} - {product.sku} ({getCategoryName(product)})
                                        </option>
                                    ))
                                )}
                            </select>
                        </div>

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
                                'Agregar al Inventario'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddInventoryModal;