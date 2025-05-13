// sesa-page/src/utils/imageUtils.ts
import { supabase } from './supabaseClient';

// Nombre del bucket en Supabase Storage
export const STORAGE_BUCKET = 'products';

/**
 * Obtiene la URL pública de una imagen en Supabase Storage
 * @param path Ruta de la imagen en el bucket
 * @returns URL pública de la imagen
 */
export const getImagePublicUrl = (path: string): string => {
    if (!path) return '';

    const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);

    return data.publicUrl;
};

/**
 * Comprueba si una URL de imagen es válida
 * @param url URL de la imagen para comprobar
 * @returns Promise que resuelve a true si la imagen es válida, false en caso contrario
 */
export const isImageUrlValid = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (!url) {
            resolve(false);
            return;
        }

        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
};

/**
 * Obtiene una imagen de respaldo en caso de que la imagen principal no esté disponible
 * @returns URL de la imagen de respaldo
 */
export const getFallbackImageUrl = (): string => {
    return '/assets/product-placeholder.jpg';
};