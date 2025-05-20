// src/components/Dashboard/WeatherWidget.tsx
import React from 'react';
import { useWeather } from '../../hooks/useWeather';
import { getWeatherIconUrl } from '../../utils/weatherService';
import { RefreshCw, Thermometer, Droplets, Wind } from 'lucide-react';

interface WeatherWidgetProps {
    city?: string;
    useCurrentLocation?: boolean;
}

const WeatherWidget: React.FC<WeatherWidgetProps> = ({
                                                         city,
                                                         useCurrentLocation = true
                                                     }) => {
    const { weatherData, error, loading, refresh } = useWeather({
        city,
        useCurrentLocation,
        refreshInterval: 30 * 60 * 1000 // Actualizar cada 30 minutos
    });

    // Formatear fecha
    const formatDate = (timestamp: number): string => {
        return new Date(timestamp * 1000).toLocaleString('es-MX', {
            weekday: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-40">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center justify-center h-40">
                <p className="text-gray-500 text-sm">{error}</p>
                <button
                    onClick={refresh}
                    className="mt-2 text-orange-500 text-sm flex items-center"
                >
                    <RefreshCw size={14} className="mr-1" /> Reintentar
                </button>
            </div>
        );
    }

    if (!weatherData) {
        return (
            <div className="bg-white rounded-lg shadow-md p-4 flex items-center justify-center h-40">
                <p className="text-gray-500 text-sm">No hay datos disponibles</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="text-gray-700 font-semibold">{weatherData.city}</h3>
                    <p className="text-sm text-gray-500">
                        {formatDate(weatherData.timestamp)}
                    </p>
                </div>
                <button
                    onClick={refresh}
                    className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                    aria-label="Actualizar"
                >
                    <RefreshCw size={16} />
                </button>
            </div>

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center">
                    <img
                        src={getWeatherIconUrl(weatherData.icon)}
                        alt={weatherData.description}
                        width="50"
                        height="50"
                    />
                    <div className="ml-2">
                        <div className="text-xl font-bold text-gray-800">
                            {weatherData.temperature}°C
                        </div>
                        <div className="text-gray-600 text-sm capitalize">
                            {weatherData.description}
                        </div>
                    </div>
                </div>

                <div className="text-gray-600 text-xs space-y-1">
                    <div className="flex items-center">
                        <Thermometer size={14} className="mr-1 text-orange-500" />
                        <span>Sensación térmica: {weatherData.temperature}°C</span>
                    </div>
                    <div className="flex items-center">
                        <Droplets size={14} className="mr-1 text-blue-500" />
                        <span>Humedad: {weatherData.humidity}%</span>
                    </div>
                    <div className="flex items-center">
                        <Wind size={14} className="mr-1 text-gray-500" />
                        <span>Viento: {weatherData.windSpeed} m/s</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeatherWidget;