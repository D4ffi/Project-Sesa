import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

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
};

// Category type for dropdown
type Category = {
    id: number;
    name: string;
};

interface EditProductModalProps {
    product: Product;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({
                                                               product,
                                                               isOpen,
                                                               onClose,
                                                               onSuccess
                                                           }) => {
    const [formData, setFormData] = useState<Omit<Product, 'created_at' | 'category_name'>>({
        id: product.id,
        category_id: product.category_id,
        name: product.name,
        description: product.description,
        price: product.price,
        sku: product.sku
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Fetch categories on component mount
    useEffect(() => {
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

        fetchCategories();
    }, []);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        // Handle number fields
        if (type === 'number') {
            setFormData(prev => ({
                ...prev,
                [name]: parseFloat(value) || 0
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { error } = await supabase
                .from('products')
                .update({
                    category_id: formData.category_id,
                    name: formData.name,
                    description: formData.description,
                    price: formData.price,
                    sku: formData.sku
                })
                .eq('id', product.id);

            if (error) throw error;

            onSuccess();
        } catch (err) {
            console.error('Error updating product:', err);
            setError(err instanceof Error ? err.message : 'Error al actualizar el producto');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Editar Producto</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 focus:outline-none"
                    >
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4">
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Descripción
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <label htmlFor="category_id" className="block text-sm font-medium text-gray-700 mb-1">
                            Categoría
                        </label>
                        <select
                            id="category_id"
                            name="category_id"
                            value={formData.category_id}
                            onChange={handleChange}
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

                    <div className="mb-4">
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                            Precio
                        </label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            step="0.01"
                            min="0"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-1">
                            SKU
                        </label>
                        <input
                            type="text"
                            id="sku"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                            required
                        />
                    </div>

                    <div className="flex justify-end space-x-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Guardando...' : 'Guardar cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProductModal;