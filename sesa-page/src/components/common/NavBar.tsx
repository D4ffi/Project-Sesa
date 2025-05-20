import {useRef, useState, useEffect} from 'react';
import './NavBar.css'
import { Menu} from "lucide-react";
import SideBar from "./SideBar.tsx";

const Navbar = () => {
    const [sidebarState, setSidebarState] = useState('closed'); // 'closed', 'opening', 'open', 'closing'
    const sidebarRef = useRef<HTMLDivElement>(null);

    const handleMenuClick = () => {
        setSidebarState('opening');
        // Cambiar a estado "open" después de un pequeño retraso
        setTimeout(() => {
            setSidebarState('open');
        }, 50);
    };

    const closeSidebar = () => {
        setSidebarState('closing');

        // Cambiar a estado "closed" después de la duración de la animación
        setTimeout(() => {
            setSidebarState('closed');
        }, 300); // 300 ms debe coincidir con la duración de la transición
    };

    const handleClickOutside = (event: MouseEvent) => {
        if (sidebarRef.current &&
            !sidebarRef.current.contains(event.target as Node) &&
            sidebarState === 'open') {
            closeSidebar();
        }
    };

    useEffect(() => {
        if (sidebarState === 'open' || sidebarState === 'closing') {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [sidebarState]);

    return (
        <div className="w-full items-center">
            <nav className="bg-gray-300 px-4 py-3 flex items-center justify-between">
                {/* Left section - Logo */}
                <div className="flex pl-6">
                    <Menu size={24} className="text-[#364153] hover:text-[#ff6900] transition-colors duration-300 cursor-pointer"
                          onClick={handleMenuClick} />
                </div>



                {/* Right section - Nav items */}
                <div className="flex items-center space-x-2 pr-6">
                    <div className="text-orange-500 font-bold text-xl">SESA</div>
                    <img src="/assets/sesa_logo.svg" alt="SESA Logo" className="h-5 w-5 mr-2" />
                    <div className="text-gray-700 font-bold text-xl">PROMO</div>
                </div>
            </nav>

            {sidebarState !== 'closed' && (
                <>
                    {/* Overlay con animación */}
                    <div
                        className={`fixed inset-0 z-40 transition-opacity ease-in-out duration-300 ${
                            sidebarState === 'closing' || sidebarState === 'opening' ? 'opacity-0' : 'opacity-50'
                        }`}
                        style={{ backgroundColor: 'rgba(0, 0, 0, 1)' }}
                        onClick={closeSidebar}
                    ></div>

                    {/* Sidebar */}
                    <div ref={sidebarRef} className="fixed inset-y-0 left-0 z-50">
                        <SideBar
                            onClose={closeSidebar}
                            isClosing={sidebarState === 'closing'}
                            isOpening={sidebarState === 'opening'}
                        />
                    </div>
                </>
            )}
        </div>
    );
};

export default Navbar;