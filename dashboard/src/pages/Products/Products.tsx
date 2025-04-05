import React from 'react';
import Layout from '../../components/common/Layout.tsx';

const Products: React.FC = () => {
    return (
        <Layout title="Products">
            <div className="container mx-auto py-12 px-4">
                <h1 className="text-3xl font-bold text-gray-700 mb-8">Nuestros Productos</h1>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {/* Aquí puedes agregar tus productos */}
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Imagen del producto</span>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-700">Playeras</h3>
                            <p className="text-gray-500 mt-2">Personalizables con tu logo o diseño</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Imagen del producto</span>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-700">Tazas</h3>
                            <p className="text-gray-500 mt-2">Tazas de cerámica personalizables</p>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500">Imagen del producto</span>
                        </div>
                        <div className="p-4">
                            <h3 className="text-lg font-semibold text-gray-700">Artículos Promocionales</h3>
                            <p className="text-gray-500 mt-2">Variedad de artículos para promocionar tu marca</p>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Products;