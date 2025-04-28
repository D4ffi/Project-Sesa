// dashboard/src/main.tsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ErrorPage from "./pages/Disable/Disable.tsx";
import SignInPage from "./pages/SignIn/SignInPage.tsx";
import { AuthProvider } from './context/AuthContext';
import Callback from './pages/Auth/Callback';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from "./pages/Dashboard/Dashboard.tsx";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductDashboard from "./pages/Product/ProductDashboard.tsx";
import CategoryPage from "./pages/Category/CategoryDashboard.tsx";
import WarehousePage from "./pages/Warehouse/WarehousePage.tsx";

// Crear una instancia de QueryClient con opciones predeterminadas
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 60 * 1000, // 30 minutos antes de considerar los datos obsoletos
            gcTime: 60 * 60 * 1000,    // 1 hora de tiempo de caché (anteriormente cacheTime)
            refetchOnWindowFocus: false, // No refetch automático al enfocar la ventana
            retry: 1 // Solo un intento de reintento en caso de error
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<SignInPage />} />
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/product" element={
                            <ProtectedRoute>
                                <ProductDashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/categories" element={
                            <ProtectedRoute>
                                <CategoryPage />
                            </ProtectedRoute>
                        } />
                        <Route path="/warehouse" element={
                            <ProtectedRoute>
                                <WarehousePage />
                            </ProtectedRoute>
                        } />
                        <Route path="/disable" element={<ErrorPage />} />
                        <Route path="/auth/callback" element={<Callback />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </AuthProvider>
    </StrictMode>,
);
