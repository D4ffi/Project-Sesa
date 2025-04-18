// dashboard/src/components/Dashboard/ActiveWarehousesCard.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Building2 } from 'lucide-react';

// Hook personalizado para obtener los datos de bodegas
const useActiveWarehouses = () => {
    const [activeWarehouses, setActiveWarehouses] = useState<number>(0);
    const [totalWarehouses, setTotalWarehouses] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWarehouses = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Obtener todas las bodegas
            const { data: allWarehouses, error: warehousesError } = await supabase
                .from('warehouses')
                .select('id, active');

            if (warehousesError) {
                throw warehousesError;
            }

            // Calcular bodegas totales y activas
            if (allWarehouses) {
                setTotalWarehouses(allWarehouses.length);
                const activeCount = allWarehouses.filter(warehouse => warehouse.active).length;
                setActiveWarehouses(activeCount);
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching warehouses:', error);
                setError(error.message || 'Error al obtener datos de bodegas');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWarehouses();
    }, []);

    return { activeWarehouses, totalWarehouses, isLoading, error, refetch: fetchWarehouses };
};

// Componente de presentación
const ActiveWarehousesCard: React.FC = () => {
    const { activeWarehouses, totalWarehouses, isLoading, error } = useActiveWarehouses();

    // Calcular porcentaje de bodegas activas
    const activePercentage = totalWarehouses > 0
        ? Math.round((activeWarehouses / totalWarehouses) * 100)
        : 0;

    return (
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 text-sm font-medium">Bodegas Activas</h3>
                <div className="bg-green-100 p-2 rounded-full">
                    <Building2 size={20} className="text-green-600" />
                </div>
            </div>

            {error && (
                <div className="text-red-500 text-sm my-2">
                    {error}
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
                </>
            )}
        </div>
    );
};

export default ActiveWarehousesCard;