import React from 'react';
// Registrar iconos de FontAwesome
const Card: React.FC = () => {
    return (
        <div className="bg-gray-100 min-h-screen">
            <div className="flex flex-col md:flex-row justify-center items-center min-h-screen p-4">
                {/* Left Section */}
                <div className="bg-red-600 text-white rounded-lg p-6 md:w-1/2 m-2">
                    <h1 className="text-2xl font-bold mb-4">
                        Te presentamos el Asistente IA de Acrobat.
                    </h1>
                    <p className="mb-4">
                        Haz preguntas a tus documentos. Extrae resúmenes con un solo clic para obtener información rápidamente, incluso sobre contratos.
                    </p>
                    <a className="underline mb-4 inline-block" href="#">
                        Más información
                    </a>
                    <div className="relative">

                        <div className="absolute bottom-0 left-0 bg-white p-4 rounded-lg shadow-lg w-3/4">
                            <h2 className="text-black font-bold">
                                Resumen del contrato
                            </h2>
                            <p className="text-black text-sm">
                                En este contrato se describen las condiciones de pago de comisiones para un asociado de ventas. La tasa es del 10% y se abona el día 15 de cada mes.
                            </p>
                            <button className="bg-gray-200 text-black mt-2 px-4 py-2 rounded-lg">
                                Lista de condiciones clave
                            </button>
                            <input
                                className="mt-2 p-2 w-full border rounded-lg"
                                placeholder="Haz una pregunta sobre estos documentos"
                                type="text"
                            />
                        </div>
                    </div>
                </div>

                {/* Right Section */}
                <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 md:w-1/2 m-2">
                    <h1 className="text-2xl font-bold mb-4">
                        Creative Cloud
                    </h1>
                    <p className="mb-2">
                        Prueba gratis Creative Cloud Todas las Aplicaciones
                    </p>
                    <p className="mb-2">
                        Creative Cloud para compañías
                    </p>
                    <p className="mb-4">
                        Precios para estudiantes: más de un 65% de descuento
                    </p>
                    <div className="bg-gray-200 text-black rounded-lg p-4">
                        <h2 className="text-xl font-bold mb-2">
                            Acrobat
                        </h2>
                        <p className="mb-2">
                            Prueba gratuita de Acrobat
                        </p>
                        <p className="mb-4">
                            Herramientas PDF en línea
                        </p>
                        <h2 className="text-xl font-bold mb-2">
                            Explorar
                        </h2>
                        <p className="mb-2">
                            Ver todos los productos
                        </p>
                        <p>
                            Ver todos los planes y precios
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Card;