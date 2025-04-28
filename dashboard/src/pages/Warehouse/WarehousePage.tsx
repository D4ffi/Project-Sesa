import { useState } from 'react';
import { Plus } from 'lucide-react';
import CRUDButton from "../../components/Productos/CrudButton.tsx";
import AddWarehouseModal from "../../components/Warehouse/AddWarehouseModal.tsx";
import WarehouseTable from "../../components/Warehouse/WarehouseTable.tsx";
import Layout from "../../components/common/Layout.tsx";

const WarehousePage = () => {
    // Create a state variable to control modal visibility
    const [isWarehouseModalOpen, setIsWarehouseModalOpen] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // Function to handle warehouse added successfully
    const handleWarehouseAdded = () => {
        // Close the modal
        setIsWarehouseModalOpen(false);
        // Increment refreshTrigger to cause WarehouseTable to refresh
        setRefreshTrigger(prev => prev + 1);
    };

    return (
        <Layout title="Bodegas">
            <div className="container mx-auto py-6 px-4">
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Panel de bodegas</h2>
                    <p className="text-gray-600">
                        Desde aquí puedes gestionar las bodegas de SESA, agregar nuevas ubicaciones,
                        editar las existentes y administrar el estado de cada una.
                    </p>
                </div>

                <div className="flex flex-row space-x-4 mb-6">
                    <CRUDButton
                        icon={Plus}
                        label="Agregar bodega"
                        onClick={() => setIsWarehouseModalOpen(true)}
                    />
                </div>

                {/* Warehouse table with selection, edit, and delete functionality */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <WarehouseTable key={refreshTrigger} />
                </div>

                {/* Include the AddWarehouseModal component */}
                <AddWarehouseModal
                    isOpen={isWarehouseModalOpen}
                    onClose={() => setIsWarehouseModalOpen(false)}
                    onSuccess={handleWarehouseAdded}
                />
            </div>
        </Layout>
    );
};

export default WarehousePage;