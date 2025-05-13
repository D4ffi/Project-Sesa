// dashboard/src/utils/imageUtils.ts
import { supabase } from './supabaseClient';

// Nombre del bucket en Supabase Storage
export const STORAGE_BUCKET = 'products';

/**
 * Sube una imagen a Supabase Storage
 * @param file Archivo a subir
 * @param folder Carpeta dentro del bucket (opcional)
 * @param onProgress Callback para actualizar el progreso de la carga
 * @returns URL pública de la imagen o null si hay error
 */
export const uploadImageToSupabase = async (
    file: File,
    folder: string = '',
    onProgress?: (progress: number) => void
): Promise<{ url: string | null; path: string | null }> => {
    try {
        // Establecer progreso inicial
        onProgress?.(10);

        // Crear nombre de archivo único
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = folder ? `${folder}/${fileName}` : fileName;

        // Simular progreso durante la carga
        let progressCounter = 20;
        const progressInterval = setInterval(() => {
            if (progressCounter < 90) {
                progressCounter += 10;
                onProgress?.(progressCounter);
            }
        }, 300);

        // Subir archivo a Supabase
        const {error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .upload(filePath, file, {
                cacheControl: '3600',
                upsert: false
            });

        // Limpiar intervalo
        clearInterval(progressInterval);

        if (error) {
            console.error('Error al subir imagen:', error);
            return { url: null, path: null };
        }

        // Obtener URL pública
        const { data: urlData } = supabase.storage
            .from(STORAGE_BUCKET)
            .getPublicUrl(filePath);

        // Establecer progreso completo
        onProgress?.(100);

        return {
            url: urlData.publicUrl,
            path: filePath
        };
    } catch (error) {
        console.error('Error al subir imagen:', error);
        return { url: null, path: null };
    }
};

/**
 * Elimina una imagen de Supabase Storage
 * @param path Ruta de la imagen en el bucket
 * @returns true si la eliminación fue exitosa, false en caso contrario
 */
export const deleteImageFromSupabase = async (path: string): Promise<boolean> => {
    try {
        const { error } = await supabase.storage
            .from(STORAGE_BUCKET)
            .remove([path]);

        if (error) {
            console.error('Error al eliminar imagen:', error);
            return false;
        }

        return true;
    } catch (error) {
        console.error('Error al eliminar imagen:', error);
        return false;
    }
};

/**
 * Obtiene la URL pública de una imagen en Supabase Storage
 * @param path Ruta de la imagen en el bucket
 * @returns URL pública de la imagen
 */
export const getImagePublicUrl = (path: string): string => {
    const { data } = supabase.storage
        .from(STORAGE_BUCKET)
        .getPublicUrl(path);

    return data.publicUrl;
};