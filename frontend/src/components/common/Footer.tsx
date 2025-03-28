import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react';

const Footer: React.FC = () => {
    return (
        <div className="bg-gray-800 text-white">
            <div className="container mx-auto py-12 px-4">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company information */}
                    <div>
                        <div className="flex items-center mb-4">
                            <img src="/assets/sesa_logo.svg" alt="SESA Logo" className="h-8 w-8 mr-2" />
                            <span className="text-orange-500 font-bold text-xl">SESA</span>
                            <span className="text-white font-bold text-xl ml-1">PROMO</span>
                        </div>
                        <p className="text-gray-300 mb-4">
                            Artículos promocionales personalizados de alta calidad para tu negocio.
                            Desde playeras y sudaderas hasta tazas y artículos de oficina.
                        </p>
                    </div>

                    {/* Quick links */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Enlaces rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/" className="text-gray-300 hover:text-orange-500 transition-colors">
                                    Inicio
                                </Link>
                            </li>
                            <li>
                                <Link to="/products" className="text-gray-300 hover:text-orange-500 transition-colors">
                                    Productos
                                </Link>
                            </li>
                            <li>
                                <Link to="/services" className="text-gray-300 hover:text-orange-500 transition-colors">
                                    Servicios
                                </Link>
                            </li>
                            <li>
                                <Link to="/about" className="text-gray-300 hover:text-orange-500 transition-colors">
                                    Nosotros
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="text-gray-300 hover:text-orange-500 transition-colors">
                                    Contacto
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact information */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Contacto</h3>
                        <ul className="space-y-3">
                            <li className="flex items-start">
                                <MapPin className="text-orange-500 mr-2 mt-1 flex-shrink-0" size={18} />
                                <span className="text-gray-300">
                  Av. Example #123, Col. Centro, Monterrey, NL, México
                </span>
                            </li>
                            <li className="flex items-center">
                                <Phone className="text-orange-500 mr-2 flex-shrink-0" size={18} />
                                <a href="tel:+528112345678" className="text-gray-300 hover:text-orange-500 transition-colors">
                                    (81) 1234-5678
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail className="text-orange-500 mr-2 flex-shrink-0" size={18} />
                                <a href="mailto:contacto@sesapromo.com" className="text-gray-300 hover:text-orange-500 transition-colors">
                                    contacto@sesapromo.com
                                </a>
                            </li>
                        </ul>
                    </div>

                    {/* Social media and newsletter */}
                    <div>
                        <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Síguenos</h3>
                        <div className="flex space-x-4 mb-6">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-orange-500 transition-colors">
                                <Facebook size={20} />
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-orange-500 transition-colors">
                                <Instagram size={20} />
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-gray-700 p-2 rounded-full hover:bg-orange-500 transition-colors">
                                <Twitter size={20} />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Copyright */}
                <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} SESA PROMO. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;