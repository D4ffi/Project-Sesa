// dashboard/src/components/Dashboard/MonthlySalesCard.tsx
import React from 'react';
import { DollarSign } from 'lucide-react';
import { useMonthlySalesQuery } from '../../hooks/useDataQueries';

const MonthlySalesCard: React.FC = () => {
    const { data, isLoading, error, dataUpdatedAt } = useMonthlySalesQuery();
    const { monthlySales = 0, percentChange = 0 } = data || {};

    return (
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 text-sm font-medium">Ventas del Mes</h3>
                <div className="bg-blue-100 p-2 rounded-full">
                    <DollarSign size={20} className="text-blue-600" />
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
                        <span className="text-2xl font-bold text-gray-800">${monthlySales.toLocaleString()}</span>
                        <span className="text-xs ml-2">MXN</span>
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

export default MonthlySalesCard;