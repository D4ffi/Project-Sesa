import { useState } from 'react';
import {Plus} from 'lucide-react';
import CRUDButton from "../../components/Productos/CrudButton.tsx";
import ProductModal from "../../components/Productos/AddModal.tsx";
import ProductTable from "../../components/Productos/ProductTable.tsx";
import Layout from "../../components/common/Layout.tsx";

const ProductPage = () => {
    // Create a state variable to control modal visibility
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Function to handle product added successfully
    const handleProductAdded = () => {
        // Close the modal
        setIsProductModalOpen(false);
        // Increment refreshTrigger to cause ProductTable to refresh
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <Layout title="Dashboard">
            <div className="container mx-auto py-6 px-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Panel de productos</h2>
                    <p className="text-gray-600">
                        Desde aquí puedes gestionar los productos, agregar, eliminar y editar los productos de SESA,
                        así como subir imágenes para ellos.
                    </p>
                </div>

                <div className="flex flex-row space-x-4 mb-6">
                    <CRUDButton
                        icon={Plus}
                        label="Agregar producto"
                        onClick={() => setIsProductModalOpen(true)}
                    />
                </div>

                {/* Product table with selection, edit, and delete functionality */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <ProductTable key={refreshTrigger} />
                </div>

                {/* Include the ProductModal component */}
                <ProductModal
                    isOpen={isProductModalOpen}
                    onClose={() => setIsProductModalOpen(false)}
                    onSuccess={handleProductAdded}
                />
            </div>
        </Layout>
    );
};

export default ProductPage;