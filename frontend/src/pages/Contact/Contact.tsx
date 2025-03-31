import React from 'react';
import Layout from '../../components/common/Layout.tsx';
import { Mail, Phone } from 'lucide-react';

const Contact: React.FC = () => {
    return (
        <Layout title="Contact">
            <div className="container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold text-gray-700 mb-8">Contáctanos</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Envíanos un mensaje</h2>
                        <form className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-gray-700 mb-2">Nombre</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="Tu nombre"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-700 mb-2">Correo electrónico</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="tu@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-gray-700 mb-2">Mensaje</label>
                                <textarea
                                    id="message"
                                    rows={5}
                                    className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    placeholder="¿En qué podemos ayudarte?"
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-6 rounded transition-colors duration-300
                                hover:cursor-pointer"
                            >
                                Enviar Mensaje
                            </button>
                        </form>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Información de contacto</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                {/*
                                <MapPin className="text-orange-500 mr-3 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Dirección</h3>
                                    <p className="text-gray-600">Av. Constitución 123, Centro, Monterrey, N.L., México</p>
                                </div>
                                */}
                            </div>
                            <div className="flex items-start">
                                <Phone className="text-orange-500 mr-3 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Teléfono</h3>
                                    <p className="text-gray-600">+52 (81) 1916-9348</p>
                                </div>
                            </div>
                            <div className="flex items-start">
                                <Mail className="text-orange-500 mr-3 mt-1" />
                                <div>
                                    <h3 className="font-semibold">Correo electrónico</h3>
                                    <p className="text-gray-600">dl_lore@hotmail.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Contact;