// dashboard/src/components/Dashboard/ActiveWarehouses.tsx
import React from 'react';
import { Building2 } from 'lucide-react';
import { useWarehousesQuery } from '../../hooks/useDataQueries';

const ActiveWarehousesCard: React.FC = () => {
    const { data, isLoading, error, dataUpdatedAt } = useWarehousesQuery();
    const { activeWarehouses = 0, totalWarehouses = 0 } = data || {};

    // Calcular porcentaje de bodegas activas
    const activePercentage = totalWarehouses > 0
        ? Math.round((activeWarehouses / totalWarehouses) * 100)
        : 0;

    return (
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 text-sm font-medium">Bodegas Activas</h3>
                <div className="bg-purple-100 p-2 rounded-full">
                    <Building2 size={20} className="text-purple-600" />
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
                        <span className="text-2xl font-bold text-gray-800">{activeWarehouses}</span>
                        <span className="text-xs ml-2">de {totalWarehouses}</span>
                    </div>

                    <div className="mt-3 flex items-center">
                        <span className="text-xs font-medium text-gray-600">
                            {activePercentage}% de bodegas activas
                        </span>
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

export default ActiveWarehousesCard;