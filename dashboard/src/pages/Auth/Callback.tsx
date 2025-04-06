// src/pages/Auth/Callback.tsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../utils/supabaseClient';

const Callback = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const handleAuthCallback = async () => {
            try {
                const { error } = await supabase.auth.getSession();

                if (error) throw error;

                // Redirigir al usuario a la página de productos después de la autenticación exitosa
                navigate('/products');
            } catch (error) {
                console.error('Error procesando auth callback:', error);
                navigate('/');
            }
        };

        handleAuthCallback();
    }, [navigate]);

    return (
        <div className="flex h-screen w-screen items-center justify-center bg-cream">
            <div className="text-center">
                <h2 className="text-xl font-bold text-dark-brown mb-2">Procesando autenticación</h2>
                <p className="text-gray-600">Por favor espera un momento...</p>
            </div>
        </div>
    );
};

export default Callback;