import React from 'react';
// import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
    return (
        <div
            className="w-full h-[40rem] relative"
            style={{
                backgroundImage: 'url(/src/assets/hero-bg.webp)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.6
            }}

        >

            {/* Contenido alineado a la izquierda */}
            <div className="absolute inset-0 flex items-center">
                <div className="text-left px-8 md:px-16 lg:px-24 max-w-screen-lg">
                    <h1 className="text-white text-4xl md:text-5xl font-bold mb-4 text-left">
                        Sesa te hace
                        <span className="text-orange-500 font-semibold"> resaltar </span>
                    </h1>

                    <h2 className="text-white text-xl md:text-2xl mb-6 text-left">
                        Cada producto es tratado con
                        <span className="text-orange-500 font-semibold"> cariño </span>
                        para que tengas
                        <span className="text-orange-500 font-semibold"> diseños únicos</span>
                    </h2>

                    {/* <Link
                        to="/products"
                        className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-8 rounded-full transition-colors duration-300"
                    >
                        Ver Productos
                    </Link> */}
                </div>
            </div>
        </div>
    );
};

export default HeroSection;