// src/components/Auth/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import React from "react";

type ProtectedRouteProps = {
    children: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-cream">
                <div className="text-center">
                    <h2 className="text-xl font-bold text-dark-brown mb-2">Cargando</h2>
                    <p className="text-gray-600">Por favor espera un momento...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;