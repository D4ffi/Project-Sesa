import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from "./pages/Home/Home.tsx";
import Contact from "./pages/Contact/Contact.tsx";
import Products from "./pages/Products/Products.tsx";
import Services from "./pages/Services/Services.tsx";
import ErrorPage from "./pages/Disable/Disable.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <BrowserRouter>
          <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/disable" element={<ErrorPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
      </BrowserRouter>
  </StrictMode>,
)
