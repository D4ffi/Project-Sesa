import React from 'react';
import './Home.css';

const Home = () => {
    return (
        <div className="home-container">
            {/* Sidebar */}
            <div className="sidebar">
                <div className="sidebar-item active">
                    <span>Inicio</span>
                </div>
                <div className="sidebar-item">
                    <span>Productos</span>
                </div>
                <div className="sidebar-item">
                    <span>Contacto</span>
                </div>
                <div className="sidebar-item">
                    <span>Info</span>
                </div>
                <div className="sidebar-item">
                    <span>Pedidos</span>
                </div>
                <div className="sidebar-item">
                    <span>Más</span>
                </div>
            </div>

            {/* Main Content */}
            <div className="main-content">
                {/* Header */}
                <header className="header">
                    <div className="hamburger-menu">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12"></line>
                            <line x1="3" y1="6" x2="21" y2="6"></line>
                            <line x1="3" y1="18" x2="21" y2="18"></line>
                        </svg>
                    </div>
                    <div className="search-bar">
                        <input type="text" placeholder="¿Qué estás queriendo buscar?" />
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

                {/* Hero Banner */}
                <div className="hero-banner">
                    <div className="hero-content">
                        <h1>Presencia que perdura</h1>
                        <p>Tu marca siempre presente en los mejores momentos</p>
                        <button className="catalog-button">
                            Ver catálogo
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Service Cards */}
                <div className="services-grid">
                    {/* Row 1 */}
                    <div className="service-card">
                        <div className="card-header">
                            <h3>Personalización de pedidos</h3>
                        </div>
                        <div className="card-content">
                            <div className="card-image-container">
                                <div className="card-image personalization"></div>
                            </div>
                        </div>
                    </div>

                    <div className="service-card">
                        <div className="card-header">
                            <h3>Cotizaciones</h3>
                        </div>
                        <div className="card-content">
                            <p>Lorem ipsum dolor sit consectetur et adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quispue aute irure et esse cillum dolore eu fugiat nulla pariatur esse mollit anim id est laborum.</p>
                            <div className="card-image-container">
                                <div className="card-image quotation-1"></div>
                            </div>
                        </div>
                    </div>

                    <div className="service-card">
                        <div className="card-header">
                            <h3>Cotizaciones</h3>
                        </div>
                        <div className="card-content">
                            <p>Lorem ipsum dolor sit consectetur et adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quispue aute irure et esse cillum dolore eu fugiat nulla pariatur esse mollit anim id est laborum.</p>
                            <div className="card-image-container">
                                <div className="card-image quotation-2"></div>
                            </div>
                        </div>
                    </div>

                    {/* Row 2 */}
                    <div className="service-card">
                        <div className="card-header">
                            <h3>Mejores Ofertas</h3>
                        </div>
                        <div className="card-content">
                            <p>Lorem ipsum dolor sit consectetur et adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quispue aute irure et esse cillum dolore eu fugiat nulla pariatur esse mollit anim id est laborum.</p>
                            <div className="card-image-container">
                                <div className="card-image offers"></div>
                            </div>
                        </div>
                    </div>

                    <div className="service-card">
                        <div className="card-header">
                            <h3>Cotizaciones</h3>
                        </div>
                        <div className="card-content">
                            <p>Lorem ipsum dolor sit consectetur et adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quispue aute irure et esse cillum dolore eu fugiat nulla pariatur esse mollit anim id est laborum.</p>
                            <div className="card-image-container">
                                <div className="card-image quotation-3"></div>
                            </div>
                        </div>
                    </div>

                    <div className="service-card">
                        <div className="card-header">
                            <h3>Cotizaciones</h3>
                        </div>
                        <div className="card-content">
                            <p>Lorem ipsum dolor sit consectetur et adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua quispue aute irure et esse cillum dolore eu fugiat nulla pariatur esse mollit anim id est laborum.</p>
                            <div className="card-image-container">
                                <div className="card-image quotation-4"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;