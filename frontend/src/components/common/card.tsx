import React from 'react';
// Registrar iconos de FontAwesome
const Card: React.FC = () => {
    return (
            <div className="flex flex-col md:flex-row justify-center items-center min-h-screen p-4">
                {/* Right Section */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 md:w-1/2 m-1">                    <h1 className="text-2xl font-bold mb-4">
                        Conoce nuestras impresiones de alta calidad
                    </h1>
                    <p className="mb-2">
                        Escoge el paquete que mas se adecue a ti
                    </p>
                    <p className="mb-2">
                        Impresiones para compañias
                    </p>
                    <p className="mb-4">
                        Precios al mayoreo: desde un 15% de descuento
                    </p>
                    <div className="bg-gray-200 text-black rounded-lg p-4">
                        <h2 className="text-xl font-bold mb-2">
                            Serigrafia
                        </h2>
                        <p className="mb-2">
                            Sudaderas, camisas, gorras, y mucho más
                        </p>
                        <p className="mb-4">
                            Acabados profesionales y duraderos
                        </p>

                    </div>
                </div>
            </div>
    );
};

export default Card;