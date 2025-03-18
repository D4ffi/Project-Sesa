import React from 'react';
// import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
    return (
        <div
            className="w-full h-[40rem] relative flex items-center justify-center"
            style={{
                backgroundImage: 'url("/api/placeholder/1600/400")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
            }}
        >
            {/* Overlay for better text visibility */}
            <div className="absolute inset-0 bg-black bg-opacity-50"></div>

            <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
                <h1 className="text-orange-500 text-4xl md:text-5xl font-bold mb-4">
                    Deja que tu marca sea inolvidable
                </h1>

                <h2 className="text-white text-xl md:text-2xl mb-6">
                    Cada producto con sesa es tratado con
                    <span className="text-orange-500 font-semibold"> cariño </span>
                    y cuidado para que tengas los mejores
                    y <span className="text-orange-500 font-semibold">diseños únicos</span>
                </h2>


                {/* <Link
                    to="/products"
                    className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
                >
                    Ver Productos
                </Link> */}
            </div>
        </div>
    );
};

export default HeroSection;