// dashboard/src/hooks/useSupabaseImages.ts
import { useState } from 'react';
import { uploadImageToSupabase, deleteImageFromSupabase, getImagePublicUrl } from '../utils/imageUtils';

interface UseSupabaseImagesReturn {
    uploadImage: (file: File, folder?: string) => Promise<{ url: string | null; path: string | null }>;
    deleteImage: (path: string) => Promise<boolean>;
    getPublicUrl: (path: string) => string;
    isUploading: boolean;
    uploadProgress: number;
    uploadError: string | null;
}

/**
 * Hook personalizado para manejar imágenes en Supabase Storage
 */
export const useSupabaseImages = (): UseSupabaseImagesReturn => {
    const [isUploading, setIsUploading] = useState<boolean>(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadError, setUploadError] = useState<string | null>(null);

    /**
     * Sube una imagen a Supabase Storage
     */
    const uploadImage = async (file: File, folder: string = ''): Promise<{ url: string | null; path: string | null }> => {
        try {
            setIsUploading(true);
            setUploadError(null);
            setUploadProgress(0);

            // Usar la función de utilidad para subir la imagen
            const result = await uploadImageToSupabase(
                file,
                folder,
                (progress) => setUploadProgress(progress)
            );

            if (!result.url) {
                throw new Error('Error al subir imagen');
            }

            return result;
        } catch (error) {
            console.error('Error al subir imagen:', error);
            setUploadError(error instanceof Error ? error.message : 'Error al subir imagen');
            return { url: null, path: null };
        } finally {
            setIsUploading(false);
        }
    };

    /**
     * Elimina una imagen de Supabase Storage
     */
    const deleteImage = async (path: string): Promise<boolean> => {
        try {
            setUploadError(null);
            return await deleteImageFromSupabase(path);
        } catch (error) {
            console.error('Error al eliminar imagen:', error);
            setUploadError(error instanceof Error ? error.message : 'Error al eliminar imagen');
            return false;
        }
    };

    /**
     * Obtiene la URL pública de una imagen
     */
    const getPublicUrl = (path: string): string => {
        return getImagePublicUrl(path);
    };

    return {
        uploadImage,
        deleteImage,
        getPublicUrl,
        isUploading,
        uploadProgress,
        uploadError
    };
};

export default useSupabaseImages;