// dashboard/src/components/Dashboard/RefreshButton.tsx
import React, { useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const MAX_REFRESHES = 20; // Máximo de actualizaciones manuales

const RefreshButton: React.FC = () => {
    const queryClient = useQueryClient();
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [refreshCount, setRefreshCount] = useState(0);
    const isRequestInProgressRef = useRef(false);
    const [showLimitMessage, setShowLimitMessage] = useState(false);

    const handleRefresh = async () => {
        // Si ya hay una solicitud en curso, ignorar este clic
        if (isRequestInProgressRef.current) {
            return;
        }

        // Si se alcanzó el límite, mostrar mensaje pero permitir el clic
        if (refreshCount >= MAX_REFRESHES) {
            setShowLimitMessage(true);
            // Ocultar el mensaje después de 3 segundos
            setTimeout(() => setShowLimitMessage(false), 3000);
            return;
        }

        // Marcar que hay una solicitud en curso
        isRequestInProgressRef.current = true;
        setIsRefreshing(true);

        try {
            // Incrementar el contador de actualizaciones
            setRefreshCount(prevCount => prevCount + 1);

            // Realizar las consultas
            await Promise.all([
                queryClient.invalidateQueries({ queryKey: ['monthlySales'] }),
                queryClient.invalidateQueries({ queryKey: ['totalProducts'] }),
                queryClient.invalidateQueries({ queryKey: ['warehouses'] })
            ]);
        } catch (error) {
            console.error('Error al actualizar datos:', error);
        } finally {
            // Marcar que ya no hay una solicitud en curso
            isRequestInProgressRef.current = false;
            setIsRefreshing(false);
        }
    };

    // Calcular actualizaciones restantes
    const remainingRefreshes = MAX_REFRESHES - refreshCount;

    return (
        <div className="flex flex-col items-end">
            <button
                onClick={handleRefresh}
                className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-700 font-medium
                    py-2 px-4 rounded-md border border-gray-300 shadow-sm transition-all duration-300
                    hover:shadow-md"
            >
                <RefreshCw size={16} className={`text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span>
                    {isRefreshing ? 'Actualizando...' : 'Actualizar datos'}
                </span>
            </button>

            {showLimitMessage ? (
                <span className="text-xs mt-1 text-red-500 font-semibold">
                    Límite de actualizaciones alcanzado
                </span>
            ) : remainingRefreshes <= MAX_REFRESHES ? (
                <span className={`text-xs mt-1 ${remainingRefreshes <= 3 ? 'text-orange-500 font-semibold' : 'text-gray-500'}`}>
                    {remainingRefreshes} actualizaciones restantes
                </span>
            ) : null}
        </div>
    );
};

export default RefreshButton;