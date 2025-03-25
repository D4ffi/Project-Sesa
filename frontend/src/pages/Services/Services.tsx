import React from 'react';
import Layout from '../../components/common/Layout.tsx';
import { Palette, Package, Truck, Settings } from 'lucide-react';

const Services: React.FC = () => {
    return (
        <Layout title="Services">
            <div className="container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold text-gray-700 mb-8">Nuestros Servicios</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="mb-4">
                            <Palette size={40} className="text-orange-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Diseño Personalizado</h2>
                        <p className="text-gray-600">
                            Nuestro equipo de diseñadores trabajará contigo para crear diseños únicos y personalizados
                            que representen la identidad de tu empresa o evento.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="mb-4">
                            <Package size={40} className="text-orange-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Productos de Calidad</h2>
                        <p className="text-gray-600">
                            Trabajamos con los mejores materiales y procesos de producción para garantizar
                            que tus productos promocionales sean duraderos y de alta calidad.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="mb-4">
                            <Truck size={40} className="text-orange-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Entrega Oportuna</h2>
                        <p className="text-gray-600">
                            Sabemos que los tiempos son importantes. Por eso, nos comprometemos a entregar
                            tus productos promocionales en el plazo acordado.
                        </p>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <div className="mb-4">
                            <Settings size={40} className="text-orange-500" />
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">Soluciones a Medida</h2>
                        <p className="text-gray-600">
                            Nos adaptamos a tus necesidades específicas. Si tienes una idea en mente que no está
                            en nuestro catálogo, podemos desarrollarla juntos.
                        </p>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Services;