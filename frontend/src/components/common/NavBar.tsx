import { useState } from 'react';
import './NavBar.css'

const Navbar = () => {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        console.log('Searching for:', searchTerm);
    };

    return (
        <div className="w-full">
            <nav className="bg-gray-800 px-4 py-3 flex items-center justify-between">
                {/* Left section - Logo */}
                <div className="flex-none">
                    {/* Burger menu would go here */}
                    <div className="text-white font-bold text-xl">SESA</div>
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
                                className="w-full bg-gray-700 text-white placeholder-gray-400 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="absolute inset-y-0 right-0 flex items-center pr-3"
                            >
                                <svg
                                    className="h-5 w-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                    />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>

                {/* Right section - Nav items */}
                <div className="flex-none">
                    <ul className="flex space-x-4 text-white">
                        <li className="cursor-pointer hover:text-blue-300">Products</li>
                        <li className="cursor-pointer hover:text-blue-300">Contact</li>
                    </ul>
                </div>
            </nav>
        </div>
    );
};

export default Navbar;