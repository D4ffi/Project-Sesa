import React from 'react';
import Button from "./Button.tsx";

const HeroSection: React.FC = () => {
    return (
        <div className="w-full h-screen relative">
            {/* Background image with full viewport height */}
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage: 'url(/assets/Hero2.jpg)',
                    height: '100vh',
                    width: '100%',
                }}
            ></div>

            {/* Content aligned to the left */}
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

                    <Button to="/products" text="Ver Productos" />
                </div>
            </div>
        </div>
    );
}

export default HeroSection;