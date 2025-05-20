// src/utils/weatherService.ts
export interface WeatherData {
    city: string;
    temperature: number;
    description: string;
    icon: string;
    humidity: number;
    windSpeed: number;
    timestamp: number;
}

export interface WeatherError {
    message: string;
    code?: number;
}

export type WeatherResponse = {
    data?: WeatherData;
    error?: WeatherError;
    loading: boolean;
};

// Clave de API - debes registrarte en OpenWeatherMap y obtener tu propia key
const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY || '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

/**
 * Obtiene datos del clima para una ciudad específica o ubicación por coordenadas
 */
export const getWeatherData = async (
    location: string | { lat: number; lon: number }
): Promise<WeatherResponse> => {
    try {
        let url: string;

        if (typeof location === 'string') {
            // Búsqueda por nombre de ciudad
            url = `${BASE_URL}?q=${encodeURIComponent(location)}&appid=${API_KEY}&units=metric&lang=es`;
        } else {
            // Búsqueda por coordenadas
            url = `${BASE_URL}?lat=${location.lat}&lon=${location.lon}&appid=${API_KEY}&units=metric&lang=es`;
        }

        const response = await fetch(url);

        if (!response.ok) {
            // Manejar errores de la API
            const errorData = await response.json();
            return {
                error: {
                    message: errorData.message || 'Error al obtener datos del clima',
                    code: response.status
                },
                loading: false
            };
        }

        const data = await response.json();

        // Transformar la respuesta al formato que necesitamos
        return {
            data: {
                city: data.name,
                temperature: Math.round(data.main.temp),
                description: data.weather[0].description,
                icon: data.weather[0].icon,
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                timestamp: data.dt
            },
            loading: false
        };
    } catch (error) {
        console.error('Error en el servicio del clima:', error);
        return {
            error: {
                message: error instanceof Error ? error.message : 'Error desconocido'
            },
            loading: false
        };
    }
};

/**
 * Obtiene la URL del icono del clima
 */
export const getWeatherIconUrl = (iconCode: string): string => {
    return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

/**
 * Obtiene el clima para la ubicación actual del usuario
 */
export const getCurrentLocationWeather = (): Promise<WeatherResponse> => {
    return new Promise((resolve) => {
        if (!navigator.geolocation) {
            resolve({
                error: { message: 'Geolocalización no soportada en este navegador' },
                loading: false
            });
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                const result = await getWeatherData({ lat: latitude, lon: longitude });
                resolve(result);
            },
            (error) => {
                console.error('Error de geolocalización:', error);
                resolve({
                    error: { message: 'No se pudo obtener la ubicación actual' },
                    loading: false
                });
            }
        );
    });
};