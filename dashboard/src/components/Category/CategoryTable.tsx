import React, { useState, useEffect } from 'react';
import { Edit, Trash2, CheckSquare, Square, ChevronUp, ChevronDown } from 'lucide-react';
import { supabase } from '../../utils/supabaseClient.ts';
import EditCategoryModal from "./EditCategoryModal.tsx";
import DeleteConfirmationModal from '../common/DeleteConfirmationModal';

// Category type based on your database schema
type Category = {
    id: number;
    created_at: string;
    name: string;
    description: string;
};

type SortDirection = 'asc' | 'desc';
type SortField = keyof Category | null;

const CategoryTable: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedCategoryIds, setSelectedCategoryIds] = useState<number[]>([]);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [sortField, setSortField] = useState<SortField>(null);
    const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
    const [searchTerm, setSearchTerm] = useState('');

    // State for delete confirmation modal
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    // Fetch categories on component mount
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);

            const { data, error } = await supabase
                .from('categories')
                .select('*');

            if (error) throw error;

            setCategories(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Error al cargar categorías');
            console.error('Error fetching categories:', err);
        } finally {
            setLoading(false);
        }
    };

    // Handle row selection
    const toggleCategorySelection = (categoryId: number) => {
        setSelectedCategoryIds(prevSelected => {
            if (prevSelected.includes(categoryId)) {
                return prevSelected.filter(id => id !== categoryId);
            } else {
                return [...prevSelected, categoryId];
            }
        });
    };

    // Handle select all
    const toggleSelectAll = () => {
        if (selectedCategoryIds.length === categories.length) {
            setSelectedCategoryIds([]);
        } else {
            setSelectedCategoryIds(categories.map(category => category.id));
        }
    };

    // Show delete confirmation modal
    const handleShowDeleteModal = () => {
        if (selectedCategoryIds.length === 0) return;
        setIsDeleteModalOpen(true);
    };

    // Delete selected categories after confirmation
    const handleDeleteConfirmed = async () => {
        try {
            const { error } = await supabase
                .from('categories')
                .delete()
                .in('id', selectedCategoryIds);

            if (error) throw error;

            // Refresh category list
            fetchCategories();
            // Clear selection
            setSelectedCategoryIds([]);
            // Close the modal
            setIsDeleteModalOpen(false);
        } catch (err) {
            console.error('Error deleting categories:', err);
            setError(err instanceof Error ? err.message : 'Error al eliminar categorías');
        }
    };

    // Edit a category
    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
    };

    // Close edit modal
    const handleCloseEditModal = () => {
        setEditingCategory(null);
    };

    // Handle successful edit
    const handleCategoryUpdated = () => {
        fetchCategories();
        setEditingCategory(null);
    };

    // Handle sorting
    const handleSort = (field: keyof Category) => {
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
    const getSortedAndFilteredCategories = () => {
        // First apply search filter
        let filteredCategories = categories;

        if (searchTerm.trim()) {
            const term = searchTerm.toLowerCase();
            filteredCategories = categories.filter(category =>
                category.name.toLowerCase().includes(term) ||
                (category.description && category.description.toLowerCase().includes(term))
            );
        }

        // Then apply sorting
        if (sortField) {
            return [...filteredCategories].sort((a, b) => {
                if (a[sortField] < b[sortField]) {
                    return sortDirection === 'asc' ? -1 : 1;
                }
                if (a[sortField] > b[sortField]) {
                    return sortDirection === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }

        return filteredCategories;
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
    const renderSortIndicator = (field: keyof Category) => {
        if (sortField !== field) return null;

        return sortDirection === 'asc'
            ? <ChevronUp className="inline w-4 h-4" />
            : <ChevronDown className="inline w-4 h-4" />;
    };

    // Get display-friendly column names
    const getColumnName = (field: keyof Category): string => {
        const columnNames: Record<keyof Category, string> = {
            id: 'ID',
            created_at: 'Fecha de creación',
            name: 'Nombre',
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
                        placeholder="Buscar categorías..."
                        className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex space-x-2">
                    {selectedCategoryIds.length === 1 && (
                        <button
                            onClick={() => handleEditCategory(categories.find(c => c.id === selectedCategoryIds[0])!)}
                            className="flex items-center bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
                        >
                            <Edit size={16} className="mr-1" /> Editar
                        </button>
                    )}

                    {selectedCategoryIds.length > 0 && (
                        <button
                            onClick={handleShowDeleteModal}
                            className="flex items-center bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 transition-colors"
                        >
                            <Trash2 size={16} className="mr-1" /> Eliminar ({selectedCategoryIds.length})
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
                                    {selectedCategoryIds.length === categories.length && categories.length > 0 ? (
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
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('description')}>
                                {getColumnName('description')} {renderSortIndicator('description')}
                            </th>
                            <th className="px-4 py-2 cursor-pointer text-center" onClick={() => handleSort('created_at')}>
                                {getColumnName('created_at')} {renderSortIndicator('created_at')}
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {getSortedAndFilteredCategories().length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                                    No se encontraron categorías
                                </td>
                            </tr>
                        ) : (
                            getSortedAndFilteredCategories().map(category => (
                                <tr
                                    key={category.id}
                                    className={`border-t border-gray-200 hover:bg-gray-50 ${
                                        selectedCategoryIds.includes(category.id) ? 'bg-orange-50' : ''
                                    }`}
                                >
                                    <td className="px-4 py-2 text-center">
                                        <button
                                            onClick={() => toggleCategorySelection(category.id)}
                                            className="focus:outline-none"
                                        >
                                            {selectedCategoryIds.includes(category.id) ? (
                                                <CheckSquare size={20} className="text-orange-500" />
                                            ) : (
                                                <Square size={20} className="text-gray-400" />
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-4 py-2 text-center">{category.id}</td>
                                    <td className="px-4 py-2 font-medium text-center">{category.name}</td>
                                    <td className="px-4 py-2 max-w-xs truncate text-center">{category.description || "-"}</td>
                                    <td className="px-4 py-2 text-center">{formatDate(category.created_at)}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Edit Modal */}
            {editingCategory && (
                <EditCategoryModal
                    category={editingCategory}
                    isOpen={!!editingCategory}
                    onClose={handleCloseEditModal}
                    onSuccess={handleCategoryUpdated}
                />
            )}

            {/* Delete Confirmation Modal */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirmed}
                itemCount={selectedCategoryIds.length}
                itemType="categoría"
                confirmationText="EliminarCategoria"
            />
        </div>
    );
};

export default CategoryTable;