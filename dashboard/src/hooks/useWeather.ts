// src/hooks/useWeather.ts
import { useState, useEffect } from 'react';
import { getWeatherData, getCurrentLocationWeather, WeatherData, WeatherResponse } from '../utils/weatherService';

interface UseWeatherProps {
    city?: string;
    useCurrentLocation?: boolean;
    refreshInterval?: number;
}

export const useWeather = ({
                               city = 'Monterrey', // Ciudad por defecto
                               useCurrentLocation = true,
                               refreshInterval = 60 * 60 * 1000 // 1 hora por defecto
                           }: UseWeatherProps = {}) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    const fetchWeather = async () => {
        setLoading(true);
        setError(null);

        try {
            let response: WeatherResponse;

            if (useCurrentLocation) {
                response = await getCurrentLocationWeather();
            } else {
                response = await getWeatherData(city);
            }

            if (response.error) {
                setError(response.error.message);
            } else if (response.data) {
                setWeatherData(response.data);
            }
        } catch (err) {
            console.error('Error al obtener el clima:', err);
            setError('No se pudo obtener la información del clima');
        } finally {
            setLoading(false);
        }
    };

    // Efecto para cargar datos al montar el componente
    useEffect(() => {
        fetchWeather();

        // Configurar intervalo de actualización
        if (refreshInterval > 0) {
            const interval = setInterval(fetchWeather, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [city, useCurrentLocation, refreshInterval]);

    return {
        weatherData,
        error,
        loading,
        refresh: fetchWeather
    };
};  