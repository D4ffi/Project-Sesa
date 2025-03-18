import React from 'react';
import './AboutUs.css';

const AboutUs = () => {
    return (
        <div className="aboutus-container">
            {/* Header */}
            <header className="aboutus-header">
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
            <div className="aboutus-content">
                {/* Title Banner */}
                <div className="title-banner">
                    <h1 className="main-title">¡Conocenos!</h1>
                </div>

                {/* Content Grid */}
                <div className="content-grid">
                    {/* Left Column - About Us */}
                    <div className="aboutus-column">
                        <div className="aboutus-card">
                            <h2>¿Quienes somos?</h2>
                            <h3>¿De dónde viene?</h3>
                            <p>
                                Al contrario del pensamiento popular, el texto de Lorem Ipsum no
                                es simplemente texto aleatorio. Tiene sus raíces en una pieza clásica
                                de la literaturus Bonorum et Malorum (Los Extremos del Bien y El Mal)
                                por Cicero, escrito en el año 45 antes de Cristo. Este libro es un
                                tratado de teoría de ética, muy popular durante el Renacimiento. La primera
                                línea del Lorem Ipsum, "Lorem ipsum dolor sit amet..", viene de una línea
                                en la sección 1.10.3
                            </p>
                        </div>

                        <div className="decorative-pattern">
                            {/* Decorative pattern with orange, gray and striped elements */}
                        </div>
                    </div>

                    {/* Right Column - Mission, Vision, and Objetivo */}
                    <div className="info-column">
                        <div className="info-card">
                            <h2>Mision</h2>
                            <p>
                                Al contrario del pensamiento popular, el texto de Lorem Ipsum no
                                es simplemente texto aleatorio. Tiene sus raíces en una pieza clásica
                                de la literaturus Bonorum et Malorum (Los Extremos del Bien y El Mal)
                                por Cicero, "Lorem ipsum dolor sit amet..", viene de una línea
                                en la sección 1.10.3
                            </p>
                        </div>

                        <div className="info-card">
                            <h2>Objetivo</h2>
                            <p>
                                Al contrario del pensamiento popular, el texto de Lorem Ipsum no
                                es simplemente texto aleatorio. Tiene sus raíces en una pieza clásica
                                de la literaturus. "", en un pasaje de Lorem Ipsum, y al seguir leyendo
                                distintos del sitio ".", viene de una línea en la sección 1.10.3
                            </p>
                        </div>

                        <div className="info-card">
                            <h2>Vision</h2>
                            <p>
                                Al contrario del pensamiento popular, el texto de Lorem Ipsum no
                                es simplemente texto aleatorio. Tiene sus raíces en Cicero. La primera
                                línea del Lorem Ipsum, "Lorem ipsum dolor sit amet..", viene de una
                                línea en la sección 1.10.3
                            </p>
                        </div>

                        <div className="info-card additional">
                            <p>
                                Al contrario del pensamiento popular, el texto de Lorem Ipsum no
                                es simplemente texto aleatorio. Tiene sus raíces en Cicero. La primera
                                línea del Lorem Ipsum, "Lorem ipsum dolor sit amet..", viene de una
                                línea en la sección 1.10.3
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <footer className="aboutus-footer">
                <p>Todos los derechos reservados © SESA 2024</p>
            </footer>

            {/* Decorative Elements */}
            <div className="left-decoration"></div>
            <div className="right-decoration"></div>
        </div>
    );
};

export default AboutUs;