import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone } from 'lucide-react';

const Footer: React.FC = () => {
    const navigate = useNavigate();

    const handleLinkClick = (path: string, smoothScroll: boolean = false) => {
        navigate(path);
        if (smoothScroll) {
            setTimeout(() => {
                document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        } else {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    };

    return (
        <div className="bg-gray-800 text-white">
            <div className="container mx-auto py-12 px-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
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

                    <div>
                        <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Enlaces rápidos</h3>
                        <ul className="space-y-2">
                            <li>
                                <span onClick={() => handleLinkClick('/')} className="text-gray-300 hover:text-orange-500 transition-colors cursor-pointer">
                                    Inicio
                                </span>
                            </li>
                            <li>
                                <span onClick={() => handleLinkClick('/products')} className="text-gray-300 hover:text-orange-500 transition-colors cursor-pointer">
                                    Productos
                                </span>
                            </li>
                            <li>
                                <span onClick={() => handleLinkClick('/services')} className="text-gray-300 hover:text-orange-500 transition-colors cursor-pointer">
                                    Servicios
                                </span>
                            </li>
                            <li>
                                <span onClick={() => handleLinkClick('/#about-us', true)} className="text-gray-300 hover:text-orange-500 transition-colors cursor-pointer">
                                    Nosotros
                                </span>
                            </li>
                            <li>
                                <span onClick={() => handleLinkClick('/contact')} className="text-gray-300 hover:text-orange-500 transition-colors cursor-pointer">
                                    Contacto
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Contacto</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center">
                                <Phone className="text-orange-500 mr-2 flex-shrink-0" size={18} />
                                <a href="tel:+528112345678" className="text-gray-300 hover:text-orange-500 transition-colors">
                                    (81) 19169348
                                </a>
                            </li>
                            <li className="flex items-center">
                                <Mail className="text-orange-500 mr-2 flex-shrink-0" size={18} />
                                <a href="mailto:contacto@sesapromo.com" className="text-gray-300 hover:text-orange-500 transition-colors">
                                    dl_lore@hotmail.com
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-gray-700 text-center text-gray-400">
                    <p>© {new Date().getFullYear()} SESA PROMO. Todos los derechos reservados.</p>
                </div>
            </div>
        </div>
    );
};

export default Footer;