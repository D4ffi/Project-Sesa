import React from 'react';
import Button from "./Button.tsx";
// import { Link } from 'react-router-dom';

const HeroSection: React.FC = () => {
    return (
        <div className="w-full h-[51rem] relative">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(/assets/Hero2.jpg)',
                    opacity: 1,
                }}
            ></div>

            {/* Contenido alineado a la izquierda */}
            <div className="absolute inset-0 flex items-center">
                <div className="text-left px-8 md:px-16 lg:px-24 max-w-screen-lg">
                    <h1 className="text-gray-700 text-4xl md:text-5xl font-bold mb-4 text-left">
                        Sesa te hace
                        <span className="text-orange-500 font-bold"> resaltar </span>
                    </h1>

                    <h2 className="text-gray-700 text-xl font-semibold md:text-2xl mb-6 text-left">
                        Cada producto es tratado con
                        <span className="text-orange-500 font-bold"> cariño </span>
                        para que tengas
                        <span className="text-orange-500 font-bold"> diseños únicos</span>
                    </h2>

                    <Button />
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
}

export default HeroSection;
