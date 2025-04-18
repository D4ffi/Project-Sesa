// dashboard/src/components/Dashboard/TotalProductCount.tsx
import React from 'react';
import { Package } from 'lucide-react';
import { useTotalProductsQuery } from '../../hooks/useDataQueries';

const TotalProductsCard: React.FC = () => {
    const { data, isLoading, error, dataUpdatedAt } = useTotalProductsQuery();
    const { totalProducts = 0, percentChange = 0 } = data || {};

    return (
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 text-sm font-medium">Total de Productos</h3>
                <div className="bg-green-100 p-2 rounded-full">
                    <Package size={20} className="text-green-600" />
                </div>
            </div>

            {error instanceof Error && (
                <div className="text-red-500 text-sm my-2">
                    {error.message || 'Error al cargar datos'}
                </div>
            )}

            {isLoading ? (
                <div className="h-10 bg-gray-200 animate-pulse rounded mt-2"></div>
            ) : (
                <>
                    <div className="flex items-baseline">
                        <span className="text-2xl font-bold text-gray-800">{totalProducts.toLocaleString()}</span>
                        <span className="text-xs ml-2">productos</span>
                    </div>

                    <div className="mt-3 flex items-center">
                        <span className={`text-xs font-medium ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {percentChange >= 0 ? '+' : ''}{percentChange}%
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs mes anterior</span>
                    </div>

                    {dataUpdatedAt && (
                        <div className="text-xs text-gray-400 mt-3">
                            Actualizado: {new Date(dataUpdatedAt).toLocaleTimeString()}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default TotalProductsCard;