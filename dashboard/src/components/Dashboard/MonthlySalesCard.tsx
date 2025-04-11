// dashboard/src/components/Dashboard/MonthlySalesCard.tsx
import React, { useState, useEffect } from 'react';
import { supabase } from '../../utils/supabaseClient';
import { DollarSign } from 'lucide-react';

// Separate hook for data fetching logic
const useMonthlySales = () => {
    const [monthlySales, setMonthlySales] = useState<number>(0);
    const [percentChange, setPercentChange] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMonthlySales = async () => {
        try {
            setIsLoading(true);
            setError(null);

            // Get current month's data
            const now = new Date();
            const currentMonth = now.getMonth();
            const currentYear = now.getFullYear();

            // Calculate first and last day of current month
            const firstDayCurrentMonth = new Date(currentYear, currentMonth, 1).toISOString();
            const lastDayCurrentMonth = new Date(currentYear, currentMonth + 1, 0).toISOString();

            // Calculate first and last day of previous month
            const firstDayPreviousMonth = new Date(currentYear, currentMonth - 1, 1).toISOString();
            const lastDayPreviousMonth = new Date(currentYear, currentMonth, 0).toISOString();

            // Fetch current month's sales
            const { data: currentMonthData, error: currentError } = await supabase
                .from('orders')
                .select('total')
                .gte('created_at', firstDayCurrentMonth)
                .lte('created_at', lastDayCurrentMonth);

            // Fetch previous month's sales
            const { data: previousMonthData, error: previousError } = await supabase
                .from('orders')
                .select('total')
                .gte('created_at', firstDayPreviousMonth)
                .lte('created_at', lastDayPreviousMonth);

            if (currentError || previousError) {
                throw currentError || previousError;
            }

            // Calculate totals
            const currentMonthTotal = currentMonthData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;
            const previousMonthTotal = previousMonthData?.reduce((sum, order) => sum + Number(order.total), 0) || 0;

            setMonthlySales(currentMonthTotal);

            // Calculate percent change
            if (previousMonthTotal > 0) {
                const change = ((currentMonthTotal - previousMonthTotal) / previousMonthTotal) * 100;
                setPercentChange(Math.round(change));
            }

        } catch (error: unknown) {
            if (error instanceof Error) {
                console.error('Error fetching monthly sales:', error);
                setError(error.message || 'Error fetching sales data');
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMonthlySales();
    }, []);

    return { monthlySales, percentChange, isLoading, error, refetch: fetchMonthlySales };
};

// UI Component separated from data fetching logic
const MonthlySalesCard: React.FC = () => {
    const { monthlySales, percentChange, isLoading, error } = useMonthlySales();

    return (
        <div className="bg-white rounded-lg shadow-md p-5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-600 text-sm font-medium">Ventas del Mes</h3>
                <div className="bg-blue-100 p-2 rounded-full">
                    <DollarSign size={20} className="text-blue-600" />
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
                        <span className="text-2xl font-bold text-gray-800">${monthlySales.toLocaleString()}</span>
                        <span className="text-xs ml-2">MXN</span>
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

export default MonthlySalesCard;