// dashboard/src/hooks/useDataQueries.ts
import { useQuery } from '@tanstack/react-query';
import { supabase } from '../utils/supabaseClient';

// Tipos
type DateRange = {
    startDate: string;
    endDate: string;
};

// Funciones utilitarias
const getMonthDateRange = (monthsAgo: number = 0): DateRange => {
    const date = new Date();
    const currentMonth = date.getMonth() - monthsAgo;
    const currentYear = date.getFullYear();

    // Ajustar el año si estamos calculando meses anteriores que cruzan años
    const targetYear = currentMonth < 0 ? currentYear - 1 : currentYear;
    const targetMonth = currentMonth < 0 ? 12 + currentMonth : currentMonth;

    const firstDay = new Date(targetYear, targetMonth, 1).toISOString();
    const lastDay = new Date(targetYear, targetMonth + 1, 0).toISOString();

    return { startDate: firstDay, endDate: lastDay };
};

const fetchOrdersTotal = async (dateRange: DateRange) => {
    const { data, error } = await supabase
        .from('orders')
        .select('total')
        .gte('created_at', dateRange.startDate)
        .lte('created_at', dateRange.endDate);

    if (error) throw error;

    return data?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
};

const calculatePercentChange = (current: number, previous: number): number => {
    if (previous <= 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
};

// Hook para obtener ventas mensuales
export const useMonthlySalesQuery = () => {
    return useQuery({
        queryKey: ['monthlySales'],
        queryFn: async () => {
            try {
                const currentMonthRange = getMonthDateRange(0);
                const previousMonthRange = getMonthDateRange(1);

                const currentMonthTotal = await fetchOrdersTotal(currentMonthRange);
                const previousMonthTotal = await fetchOrdersTotal(previousMonthRange);

                const percentChange = calculatePercentChange(currentMonthTotal, previousMonthTotal);

                return { monthlySales: currentMonthTotal, percentChange };
            } catch (error) {
                console.error('Error fetching monthly sales:', error);
                throw error;
            }
        }
    });
};

// Hook para obtener total de productos
export const useTotalProductsQuery = () => {
    return useQuery({
        queryKey: ['totalProducts'],
        queryFn: async () => {
            try {
                // Obtener el recuento total de productos actuales
                const { count: currentCount, error: currentError } = await supabase
                    .from('products')
                    .select('*', { count: 'exact', head: true });

                if (currentError) throw currentError;

                // Para datos de cambio porcentual
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                const oneMonthAgoStr = oneMonthAgo.toISOString();

                const { data: recentProducts, error: recentError } = await supabase
                    .from('products')
                    .select('created_at')
                    .gte('created_at', oneMonthAgoStr);

                if (recentError) throw recentError;

                const recentAdditions = recentProducts?.length || 0;
                const olderProducts = (currentCount || 0) - recentAdditions;

                const percentChange = calculatePercentChange(recentAdditions, olderProducts);

                return { totalProducts: currentCount || 0, percentChange };
            } catch (error) {
                console.error('Error fetching total products:', error);
                throw error;
            }
        }
    });
};

// Hook para obtener datos de bodegas
export const useWarehousesQuery = () => {
    return useQuery({
        queryKey: ['warehouses'],
        queryFn: async () => {
            try {
                const { data: allWarehouses, error } = await supabase
                    .from('warehouses')
                    .select('id, active');

                if (error) throw error;

                const totalWarehouses = allWarehouses?.length || 0;
                const activeWarehouses = allWarehouses?.filter(warehouse => warehouse.active).length || 0;

                return { activeWarehouses, totalWarehouses };
            } catch (error) {
                console.error('Error fetching warehouses:', error);
                throw error;
            }
        }
    });
};