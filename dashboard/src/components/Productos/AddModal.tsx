// dashboard/src/components/Productos/AddModal.tsx - VERSIÓN CORREGIDA
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';
import MultipleImageUploader from './MultipleImageUploader';

// Definición de tipos
interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

interface Category {
    id: number;
    name: string;
    description?: string;
}

interface ProductImage {
    url: string;
    path: string;
    isPrimary: boolean;
}

// Componente de modal para añadir productos
const ProductModal: React.FC<ProductModalProps> = ({ isOpen, onClose, onSuccess }) => {
    // Estado del formulario
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        sku: '',
        category_id: '',
        dimensions: '',
        material: '',
    });

    // Estado para imágenes
    const [productImages, setProductImages] = useState<ProductImage[]>([]);

    // Estados auxiliares
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Obtener categorías al montar el componente
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const { data, error } = await supabase
                    .from('categories')
                    .select('id, name, description')
                    .order('name', { ascending: true });

                if (error) throw error;

                setCategories(data || []);
            } catch (err) {
                console.error('Error al cargar categorías:', err);
                setError('Error al cargar categorías. Por favor, intente nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) fetchCategories();
    }, [isOpen]);

    // Manejar cambios en los inputs
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // Validar formulario
    const validateForm = () => {
        if (!formData.name.trim()) {
            setError('El nombre del producto es obligatorio');
            return false;
        }

        if (!formData.category_id) {
            setError('Debe seleccionar una categoría');
            return false;
        }

        if (!formData.price || parseFloat(formData.price) <= 0) {
            setError('El precio debe ser mayor que cero');
            return false;
        }

        return true;
    };

    // Manejar cambios en las imágenes
    const handleImagesChange = (images: ProductImage[]) => {
        setProductImages(images);
    };

    // Enviar formulario
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!validateForm()) return;

        setLoading(true);

        try {
            // 1. Insertar producto en Supabase
            const { data: productData, error: productError } = await supabase
                .from('products')
                .insert({
                    name: formData.name,
                    description: formData.description || null,
                    price: parseFloat(formData.price),
                    sku: formData.sku || null,
                    category_id: parseInt(formData.category_id),
                    dimensions: formData.dimensions || null,
                    material: formData.material || null,
                })
                .select('id')
                .single();

            if (productError) throw productError;

            const productId = productData.id;

            // 2. Insertar información de las imágenes en Supabase
            if (productImages.length > 0) {
                const productImagesData = productImages.map(img => ({
                    product_id: productId,
                    url: img.url,
                    is_primary: img.isPrimary,
                    alt_text: formData.name,
                    path: img.path
                }));

                const { error: imageError } = await supabase
                    .from('product_images')
                    .insert(productImagesData);

                if (imageError) throw imageError;
            }

            // Restablecer formulario
            setFormData({
                name: '',
                description: '',
                price: '',
                sku: '',
                category_id: '',
                dimensions: '',
                material: '',
            });
            setProductImages([]);

            // Notificar al componente padre y cerrar modal
            onSuccess();
            onClose();

        } catch (err) {
            console.error('Error al añadir producto:', err);
            setError(err instanceof Error ? err.message : 'Ha ocurrido un error al guardar el producto');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center p-4 border-b">
                <h2 className="text-xl font-bold text-gray-800">Agregar Nuevo Producto</h2>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Información del Producto */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700 border-b pb-2">Información del Producto</h3>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Nombre <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Categoría <span className="text-red-500">*</span>
                            </label>
                            <select
                                name="category_id"
                                value={formData.category_id}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                required
                            >
                                <option value="">Seleccionar categoría</option>
                                {categories.map(category => (
                                    <option key={category.id} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Precio <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">$</span>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    className="w-full pl-7 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                SKU
                            </label>
                            <input
                                type="text"
                                name="sku"
                                value={formData.sku}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Dimensiones
                            </label>
                            <input
                                type="text"
                                name="dimensions"
                                value={formData.dimensions}
                                onChange={handleInputChange}
                                placeholder="Ejemplo: 10x15x5 cm"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Material
                            </label>
                            <input
                                type="text"
                                name="material"
                                value={formData.material}
                                onChange={handleInputChange}
                                placeholder="Ejemplo: Algodón, Cerámica, etc."
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-medium mb-1">
                                Descripción
                            </label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                        </div>
                    </div>

                    {/* Imágenes */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-gray-700 border-b pb-2">Imágenes del Producto</h3>

                        {/* Componente para múltiples imágenes */}
                        <MultipleImageUploader
                            onImagesChange={handleImagesChange}
                            maxImages={5}
                        />
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
                            'Guardar Producto'
                        )}
                    </button>
                </div>
            </form>
        </div>
    </div>
);
};

export default ProductModal;