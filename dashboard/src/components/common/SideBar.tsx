import {LucideHouse, LucideX, LucideShoppingBag, LucideInfo, LucideShapes, LucideLogOut} from "lucide-react";
import MenuButton from "./MenuButton.tsx";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.tsx";

interface SideBarProps {
    onClose: () => void;
    isClosing: boolean;
    isOpening: boolean;
}

const SideBar = ({ onClose, isClosing, isOpening }: SideBarProps) => {
    const navigate = useNavigate();
    const { signOut } = useAuth();

    const handleHomeClick = () => {
        // Close the sidebar
        onClose();

        // Check if we're already on the home page
        if (window.location.pathname === "/") {
            // If we're on the home page, just scroll to top with smooth behavior
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
        } else {
            // If we're on another page, navigate to home first
            navigate("/");

            // Then scroll to top after a small delay to ensure navigation completes
            setTimeout(() => {
                window.scrollTo({
                    top: 0,
                    behavior: "smooth"
                });
            }, 100);
        }
    };

    // Manejador para el cierre de sesión
    const handleSignOut = async () => {
        await signOut();
        onClose(); // Cierra el sidebar
        navigate('/'); // Redirige al usuario a la página de inicio de sesión
    };

    return (
        <div
            className={`bg-gray-300 flex flex-col h-full w-64 transform transition-transform duration-300 ease-in-out ${
                isOpening ? '-translate-x-full' : isClosing ? '-translate-x-full' : 'translate-x-0'
            }`}
        >
            {/* Header with logo and X button */}
            <div className="flex justify-between items-center p-4">
                <h1 className="text-2xl font-bold text-gray-700">Menu</h1>
                <LucideX
                    className="text-2xl text-gray-700 hover:text-[#ff6900] transition-colors duration-300 cursor-pointer"
                    onClick={onClose}
                />
            </div>

            {/* Main content area - using flex-grow to take available space */}
            <div className="flex-grow flex flex-col items-center justify-center space-y-4 p-4">
                <div onClick={handleHomeClick}>
                    <MenuButton name="Inicio" icon={LucideHouse} to="/" />
                </div>
                <div onClick={onClose}>
                    <MenuButton name="Productos" icon={LucideShoppingBag} to="/product" />
                </div>
                <div onClick={onClose}>
                    <MenuButton name="Categorías" icon={LucideShapes} to="/categories" />
                </div>
                <div onClick={onClose}>
                    <MenuButton name="Bodegas" icon={LucideInfo} to="/warehouses" />
                </div>
                <div onClick={onClose}>
                    <button
                        onClick={handleSignOut}
                        className="group flex items-center space-x-2 bg-orange-500 p-2 rounded w-40 hover:bg-orange-700 transition-colors duration-300 cursor-pointer"
                    >
                        <LucideLogOut className="mr-2" size={18} />
                        Cerrar Sesión
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 text-center">
                <p className="text-sm text-gray-700">© 2025 Sesa Promocionales</p>
            </div>
        </div>
    );
};

export default SideBar;