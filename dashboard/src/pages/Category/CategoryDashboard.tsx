import { useState } from 'react';
import { Plus } from 'lucide-react';
import CRUDButton from "../../components/Productos/CrudButton.tsx";
import AddCategoryModal from "../../components/Category/AddCategoryModal.tsx";
import CategoryTable from "../../components/Category/CategoryTable.tsx";
import Layout from "../../components/common/Layout.tsx";

const CategoryPage = () => {
    // Create a state variable to control modal visibility
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Function to handle category added successfully
    const handleCategoryAdded = () => {
        // Close the modal
        setIsCategoryModalOpen(false);
        // Increment refreshTrigger to cause CategoryTable to refresh
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <Layout title="Categorías">
            <div className="container mx-auto py-6 px-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Panel de categorías</h2>
                    <p className="text-gray-600">
                        Desde aquí puedes gestionar las categorías de productos de SESA, agregar nuevas categorías,
                        editar las existentes y eliminar las que ya no sean necesarias.
                    </p>
                </div>

                <div className="flex flex-row space-x-4 mb-6">
                    <CRUDButton
                        icon={Plus}
                        label="Agregar categoría"
                        onClick={() => setIsCategoryModalOpen(true)}
                    />
                </div>

                {/* Category table with selection, edit, and delete functionality */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <CategoryTable key={refreshTrigger} />
                </div>

                {/* Include the CategoryModal component */}
                <AddCategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={() => setIsCategoryModalOpen(false)}
                    onSuccess={handleCategoryAdded}
                />
            </div>
        </Layout>
    );
};

export default CategoryPage;