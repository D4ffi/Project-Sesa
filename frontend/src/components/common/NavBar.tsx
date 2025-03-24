import { useState } from 'react';
import './NavBar.css'
import { Menu, Search} from "lucide-react";

{/* Para usar los iconos, primero tienes
    que importarlos asi como en la linea 3
    busca lucide icons para que veas todos
    y se usan y se personalizan asi como en
    la linea 25 y 44                        */}


const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    return (
        <div className="w-full items-center">
            <nav className="bg-gray-300 px-4 py-3 flex items-center justify-between">
                {/* Left section - Logo */}
                <div className="flex pl-6">
                    <Menu size={24} className="text-[#364153]
                     hover:text-[#ff6900] transition-colors duration-300 cursor-pointer"/>
                </div>

                {/* Middle section - Search bar */}
                <div className="flex-1 max-w-[700px] mx-auto">
                    <form onSubmit={handleSearch}>
                        <div className="relative">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search"
                                className="w-full bg-gray-200 text-gray-700 placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            />
                            <button
                                type="submit"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                <Search size={20} className="text-gray-700 hover:text-[#ff6900] cursor-pointer transition-colors duration-300"/>

                            </button>
                        </div>
                    </form>
                </div>

                {/* Right section - Nav items */}
                <div className="flex items-center space-x-2 pr-6">
                    <div className="text-orange-500 font-bold text-xl">SESA</div>
                    <img src="/assets/sesa_logo.svg" alt="SESA Logo" className="h-5 w-5 mr-2" />
                    <div className="text-gray-700 font-bold text-xl">PROMO</div>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;