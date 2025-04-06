import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Contact from "./pages/Contact/Contact.tsx";
import Products from "./pages/Products/Products.tsx";
import Services from "./pages/Services/Services.tsx";
import ErrorPage from "./pages/Disable/Disable.tsx";
import SignInPage from "./pages/SignIn/SignInPage.tsx";
import { AuthProvider } from './context/AuthContext';
import Callback from './pages/Auth/Callback';
import ProtectedRoute from './components/Auth/ProtectedRoute';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<SignInPage />} />
                    <Route path="/products" element={
                        <ProtectedRoute>
                            <Products />
                        </ProtectedRoute>
                    } />
                    <Route path="/services" element={
                        <ProtectedRoute>
                            <Services />
                        </ProtectedRoute>
                    } />
                    <Route path="/contact" element={
                        <ProtectedRoute>
                            <Contact />
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