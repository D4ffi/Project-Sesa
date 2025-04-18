// dashboard/src/pages/Dashboard/Dashboard.tsx
import MonthlySalesCard from "../../components/Dashboard/MonthlySalesCard.tsx";
import TotalProductsCard from "../../components/Dashboard/TotalProductCount.tsx";
import Layout from "../../components/common/Layout.tsx";
import ActiveWarehousesCard from "../../components/Dashboard/ActiveWarehouses.tsx";
import DashboardLinkButton from "../../components/Dashboard/DashboardLinkButton.tsx";
import RefreshButton from "../../components/Dashboard/RefreshButton.tsx"; // Importar el nuevo componente
import { LayoutDashboard, Package } from "lucide-react";

const Dashboard = () => {
    return (
        <Layout title="Dashboard">
            <div className="container mx-auto py-6 px-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Panel de Control</h1>
                    <RefreshButton /> {/* Agregar el botón de refrescar */}
                </div>

                {/* Resto del contenido existente */}

                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Bienvenido al Panel de Administración</h2>
                    <p className="text-gray-600">
                        Desde aquí puedes gestionar los productos, ver estadísticas de ventas y
                        administrar el inventario de SESA Promocionales.
                    </p>
                </div>

                {/* Botones de navegación */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <div className="flex flex-row space-x-4 col-span-1 md:col-span-2 lg:col-span-3">
                        <DashboardLinkButton
                            to="/products"
                            label="Productos"
                            icon={Package}
                        />

                        <DashboardLinkButton
                            to="/categories"
                            label="Categorías"
                            icon={LayoutDashboard}
                        />
                    </div>
                </div>

                {/* Tarjetas de estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                    <MonthlySalesCard />
                    <TotalProductsCard />
                    <ActiveWarehousesCard />
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;