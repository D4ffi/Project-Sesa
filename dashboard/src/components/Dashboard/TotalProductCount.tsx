// dashboard/src/components/Dashboard/TotalProductsCard.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { Package } from 'lucide-react';

// Hook personalizado para separar la lógica de obtención de datos
const useTotalProducts = () => {
    const [totalProducts, setTotalProducts] = useState<number>(0);
    const [percentChange, setPercentChange] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTotalProducts = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Obtener el recuento total de productos actuales
            const { count: currentCount, error: currentError } = await supabase
                .from('products')
                .select('*', { count: 'exact', head: true });

            if (currentError) {
                throw currentError;
            }

            // Establecer el total de productos
            setTotalProducts(currentCount || 0);

            // Para calcular el cambio porcentual, necesitaríamos datos históricos
            // Aquí podríamos usar una columna de fecha de creación para comparar con el mes pasado
            // Por ahora, establecemos un valor fijo o podríamos consultar una tabla de estadísticas

            // Ejemplo simulado para calcular el cambio:
            // En un sistema real, esto se basaría en datos históricos almacenados
            const { data: recentProducts, error: recentError } = await supabase
                .from('products')
                .select('created_at')
                .order('created_at', { ascending: false })
                .limit(10);

            if (recentError) {
                throw recentError;
            }

            // Calcular cuántos productos se agregaron en el último mes
            const now = new Date();
            const oneMonthAgo = new Date();
            oneMonthAgo.setMonth(now.getMonth() - 1);

            const recentAdditions = recentProducts?.filter(product => {
                const createdAt = new Date(product.created_at);
                return createdAt >= oneMonthAgo;
            }).length || 0;

            // Calcular cambio porcentual basado en adiciones recientes
            if (currentCount && currentCount > 0) {
                const change = (recentAdditions / (currentCount - recentAdditions)) * 100;
                setPercentChange(Math.round(change));
            } else {
                setPercentChange(0);
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error al obtener el total de productos:', error);
                setError(error.message || 'Error al obtener datos de productos');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTotalProducts();
    }, []);

    return { totalProducts, percentChange, isLoading, error, refetch: fetchTotalProducts };
};

// Componente UI separado de la lógica de obtención de datos
const TotalProductsCard: React.FC = () => {
    const { totalProducts, percentChange, isLoading, error } = useTotalProducts();

    return (
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 text-sm font-medium">Total de Productos</h3>
                <div className="bg-green-100 p-2 rounded-full">
                    <Package size={20} className="text-green-600" />
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
                        <span className="text-2xl font-bold text-gray-800">{totalProducts.toLocaleString()}</span>
                        <span className="text-xs ml-2">productos</span>
                    </div>

                    <div className="mt-3 flex items-center">
                        <span className={`text-xs font-medium ${percentChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {percentChange >= 0 ? '+' : ''}{percentChange}%
                        </span>
                        <span className="text-xs text-gray-500 ml-1">vs mes anterior</span>
                    </div>
                </>
            )}
        </div>
    );
};

export default TotalProductsCard;