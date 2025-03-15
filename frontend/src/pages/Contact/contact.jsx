import React from 'react';
import './contact.css';

const Contact = () => {
    return (
        <div className="contact-container">
            {/* Header */}
            <header className="contact-header">
                <div className="hamburger-menu">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </div>
                <div className="search-bar">
                    <input type="text" placeholder="Buscar" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>
                <div className="theme-toggle">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="5"></circle>
                        <line x1="12" y1="1" x2="12" y2="3"></line>
                        <line x1="12" y1="21" x2="12" y2="23"></line>
                        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                        <line x1="1" y1="12" x2="3" y2="12"></line>
                        <line x1="21" y1="12" x2="23" y2="12"></line>
                        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                    </svg>
                </div>
                <div className="user-avatar">
                    <div className="avatar-circle">
                        <div className="avatar-half light"></div>
                        <div className="avatar-half dark"></div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="contact-content">
                {/* Contact Form */}
                <div className="contact-form-section">
                    <div className="form-header">
                        <h2>Envíanos un mensaje</h2>
                        <p>Completa el formulario y te responderemos a la brevedad.</p>
                    </div>

                    <form className="contact-form">
                        <div className="form-group">
                            <label htmlFor="name">Nombre completo</label>
                            <input type="text" id="name" placeholder="" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="email">Correo electrónico</label>
                            <input type="email" id="email" placeholder="ejemplo@email.com" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="subject">Asunto</label>
                            <input type="text" id="subject" placeholder="¿Sobre qué quieres hablar?" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Mensaje</label>
                            <textarea id="message" rows="4" placeholder="Escribe tu mensaje aquí..."></textarea>
                        </div>

                        <button type="submit" className="submit-button">Enviar</button>
                    </form>

                    <div className="decorative-shape">
                        <div className="shape-part gray"></div>
                        <div className="shape-part tan"></div>
                        <div className="shape-part orange"></div>
                        <div className="shape-part dark-gray"></div>
                        <div className="shape-part black"></div>
                    </div>
                </div>

                {/* Social Media and Contact Info */}
                <div className="contact-info-section">
                    <div className="social-media">
                        <a href="#" className="social-icon facebook">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                            </svg>
                        </a>
                        <a href="#" className="social-icon instagram">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                            </svg>
                        </a>
                        <a href="#" className="social-icon twitter">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                            </svg>
                        </a>
                    </div>

                    <div className="contact-info-card">
                        <h3>Información de contacto</h3>
                        <p>Calle Hidalgo 1234, 5to piso</p>
                        <p>Sábados: 10:00 AM - 2:00 PM</p>
                    </div>

                    <div className="map-container">
                        <p>Mapa de ubicación (Google Maps irá aquí)</p>
                    </div>
                </div>
            </div>

            {/* Footer Decorations */}
            <div className="footer-decorations">
                <div className="left-decoration">
                    <div className="decoration-part"></div>
                </div>
                <div className="right-decoration">
                    <div className="decoration-part"></div>
                </div>
            </div>
        </div>
    );
};

export default Contact;