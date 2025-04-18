import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ErrorPage from "./pages/Disable/Disable.tsx";
import SignInPage from "./pages/SignIn/SignInPage.tsx";
import { AuthProvider } from './context/AuthContext';
import Callback from './pages/Auth/Callback';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import Dashboard from "./pages/Dashboard/Dashboard.tsx";

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SignInPage />} />
                    <Route path="/dashboard" element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } />
                    <Route path="/disable" element={<ErrorPage />} />
                    <Route path="/auth/callback" element={<Callback />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    </StrictMode>,
)