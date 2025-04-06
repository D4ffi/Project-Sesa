import React, { useState } from 'react';
import { FaApple, FaGoogle } from 'react-icons/fa';
import { supabase } from '../../utils/supabaseClient.ts'; // Adjust the path as needed
import '../../index.css';
import {useNavigate} from "react-router-dom";

const SignInCard = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // En handleSubmit de MainCard.tsx
    const navigate = useNavigate(); // Agrega esta línea al inicio del componente

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const {error } = await supabase.auth.signInWithPassword({
                email: formData.email,
                password: formData.password,
            });

            if (error) throw error;

            // Redirigir al usuario después del inicio de sesión exitoso
            navigate('/products');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || 'Error al iniciar sesión');
            } else {
                setError('Error desconocido al iniciar sesión');
            }
            console.error('Login error:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async (e: React.MouseEvent) => {
        e.preventDefault();

        if (!formData.email) {
            setError('Por favor introduce tu correo electrónico para recuperar la contraseña');
            return;
        }

        setLoading(true);
        try {
            const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
                redirectTo: `${window.location.origin}/reset-password`,
            });

            if (error) throw error;
            alert('Se ha enviado un correo para restablecer la contraseña');
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || 'Error al enviar el correo de recuperación');
            } else {
                setError('Error desconocido al enviar el correo de recuperación');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                }
            });
            if (error) throw error;
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || 'Error al iniciar sesión con Google');
            } else {
                setError('Error desconocido al iniciar sesión con Google');
            }
        }
    };

    const handleAppleSignIn = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'apple',
                options: {
                    redirectTo: `${window.location.origin}/dashboard`,
                }
            });
            if (error) throw error;
        } catch (error: unknown) {
            if (error instanceof Error) {
                setError(error.message || 'Error al iniciar sesión con Apple');
            } else {
                setError('Error desconocido al iniciar sesión con Apple');
            }
        }
    };

    return (
        <div className="bg-cream-mid/50 rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-dark-brown mb-8">Iniciar Sesión</h2>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-dark-brown mb-1">
                        Correo Electrónico
                    </label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        className="w-full px-4 py-2 border border-gray-300 bg-gray-200 rounded-md hover:border-orange-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.email}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label htmlFor="password" className="block text-sm font-medium text-dark-brown mb-1">
                        Contraseña
                    </label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="w-full px-4 py-2 border border-gray-300 bg-gray-200 rounded-md hover:border-orange-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.password}
                        onChange={handleChange}
                    />
                    <div className="mt-2 text-right">
                        <button
                            onClick={handleForgotPassword}
                            className="text-sm text-dark-brown hover:text-gray-900 hover:underline cursor-pointer font-medium"
                        >
                            Olvidé mi contraseña
                        </button>
                    </div>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-700 cursor-pointer text-white font-medium rounded-md transition duration-300 disabled:bg-orange-300"
                    >
                        {loading ? 'Cargando...' : 'Iniciar Sesión'}
                    </button>
                </div>
            </form>

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm my-4">
                        <span className="px-2 bg-cream-mid/50 text-dark-brown">O continuar con</span>
                    </div>
                </div>

                <div className="mt-6 flex justify-center space-x-6">
                    <button
                        type="button"
                        onClick={handleAppleSignIn}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white hover:bg-black/90 cursor-pointer transition duration-300"
                    >
                        <FaApple size={20} />
                    </button>

                    <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-white border border-gray-300 text-red-500 hover:bg-gray-200 cursor-pointer transition duration-300"
                    >
                        <FaGoogle size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SignInCard;