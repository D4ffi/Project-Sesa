import React, { useState } from 'react';
import { FaApple, FaGoogle } from 'react-icons/fa';
import '../../index.css'

const SignInCard = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form data submitted:', formData);
        // Here you would typically handle the authentication logic
    };

    const handleForgotPassword = (e: React.MouseEvent) => {
        e.preventDefault();
        console.log('Forgot password clicked');
        // Aquí implementarías la lógica para recuperar contraseña
    };

    return (
        <div className="bg-cream-mid/50 rounded-lg shadow-xl p-8 w-full max-w-md">
            <h2 className="text-2xl font-bold text-center text-dark-brown mb-8">Iniciar Sesión</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label htmlFor="username" className="block text-sm font-medium text-dark-brown mb-1">
                        Usuario
                    </label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        required
                        className="w-full px-4 py-2 border border-gray-300 bg-gray-200 rounded-md hover:border-orange-500 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                        value={formData.username}
                        onChange={handleChange}
                    />
                </div>

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
                        className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-700 cursor-pointer text-white font-medium rounded-md transition duration-300"
                    >
                        Iniciar Sesión
                    </button>
                </div>
            </form>

            <div className="mt-8">
                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <br/>
                </div>

                <div className="mt-6 flex justify-center space-x-6">
                    <button
                        type="button"
                        className="flex items-center justify-center w-12 h-12 rounded-full bg-black text-white hover:bg-black/90 cursor-pointer transition duration-300"
                    >
                        <FaApple size={20} />
                    </button>

                    <button
                        type="button"
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