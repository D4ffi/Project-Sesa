import React, { useState } from 'react';
import { X } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient';

// Warehouse type based on database schema (sin capacidad)
type Warehouse = {
    id: number;
    created_at: string;
    name: string;
    location: string;
    active: boolean;
    description?: string;
};

interface EditWarehouseModalProps {
    warehouse: Warehouse;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
}

const EditWarehouseModal: React.FC<EditWarehouseModalProps> = ({
                                                                   warehouse,
                                                                   isOpen,
                                                                   onClose,
                                                                   onSuccess
                                                               }) => {
    const [formData, setFormData] = useState<Omit<Warehouse, 'created_at'>>({
        id: warehouse.id,
        name: warehouse.name,
        location: warehouse.location,
        active: warehouse.active,
        description: warehouse.description || ''
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handle form input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;

        if (type === 'checkbox') {
            const target = e.target as HTMLInputElement;
            setFormData(prev => ({
                ...prev,
                [name]: target.checked
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
            // Validate form data
            if (!formData.name.trim()) {
                throw new Error('El nombre de la bodega es obligatorio');
            }

            if (!formData.location.trim()) {
                throw new Error('La ubicación de la bodega es obligatoria');
            }

            const { error } = await supabase
                .from('warehouses')
                .update({
                    name: formData.name,
                    location: formData.location,
                    active: formData.active,
                    description: formData.description || null
                })
                .eq('id', warehouse.id);

            if (error) throw error;

            onSuccess();
        } catch (err) {
            console.error('Error updating warehouse:', err);
            setError(err instanceof Error ? err.message : 'Error al actualizar la bodega');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">Editar Bodega</h2>
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
                            Nombre <span className="text-red-500">*</span>
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
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                            Ubicación <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
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
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        ></textarea>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={formData.active}
                                onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
                                className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                            />
                            <label htmlFor="active" className="ml-2 block text-sm text-gray-700">
                                Bodega activa
                            </label>
                        </div>
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

export default EditWarehouseModal;