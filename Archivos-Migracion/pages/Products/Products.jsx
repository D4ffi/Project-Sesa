import React, { useState } from 'react';
import './Products.css';

const Products = () => {
    // Estado para el dropdown de ordenamiento
    const [sortOption, setSortOption] = useState('Destacados');

    // Datos de ejemplo para los productos
    const productData = Array(12).fill({
        title: "Sed ut perspiciatis unde omnis iste natus error sit voluptatem"
    });

    return (
        <div className="products-container">
            {/* Header */}
            <header className="products-header">
                <div className="title-bar">Productos</div>
                <div className="controls-bar">
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
                </div>
            </header>

            {/* Main Content */}
            <div className="products-layout">
                {/* Sidebar - Filters */}
                <aside className="products-sidebar">
                    <div className="filter-section">
                        <h3>Filtrar Productos</h3>
                        <div className="search-filter">
                            <input type="text" placeholder="🔍" />
                        </div>

                        <div className="filter-group">
                            <h4>Categoría</h4>
                            <ul className="filter-list">
                                <li><input type="checkbox" id="cat1" /><label htmlFor="cat1">Categoría 1</label></li>
                                <li><input type="checkbox" id="cat2" /><label htmlFor="cat2">Categoría 2</label></li>
                                <li><input type="checkbox" id="cat3" /><label htmlFor="cat3">Categoría 3</label></li>
                                <li><input type="checkbox" id="cat4" /><label htmlFor="cat4">Categoría 4</label></li>
                                <li><input type="checkbox" id="cat5" /><label htmlFor="cat5">Categoría 5</label></li>
                            </ul>
                        </div>

                        <div className="filter-group">
                            <h4>Ordenar por</h4>
                            <ul className="filter-list">
                                <li><input type="radio" name="sort" id="sort1" /><label htmlFor="sort1">Popularidad</label></li>
                                <li><input type="radio" name="sort" id="sort2" /><label htmlFor="sort2">Precio: menor a mayor</label></li>
                                <li><input type="radio" name="sort" id="sort3" /><label htmlFor="sort3">Precio: mayor a menor</label></li>
                                <li><input type="radio" name="sort" id="sort4" /><label htmlFor="sort4">A-Z</label></li>
                                <li><input type="radio" name="sort" id="sort5" /><label htmlFor="sort5">Z-A</label></li>
                            </ul>
                        </div>

                        <div className="filter-group">
                            <h4>Precio</h4>
                            <div className="price-range">
                                <input type="number" placeholder="0" className="price-min" />
                                <div className="price-divider"></div>
                                <input type="number" placeholder="max" className="price-max" />
                            </div>
                        </div>

                        <div className="filter-group">
                            <h4>Tipo de evento</h4>
                            <ul className="filter-list">
                                <li><input type="checkbox" id="event1" /><label htmlFor="event1">Evento 1</label></li>
                                <li><input type="checkbox" id="event2" /><label htmlFor="event2">Evento 2</label></li>
                                <li><input type="checkbox" id="event3" /><label htmlFor="event3">Evento 3</label></li>
                                <li><input type="checkbox" id="event4" /><label htmlFor="event4">Evento 4</label></li>
                            </ul>
                        </div>

                        <div className="filter-group">
                            <h4>Personalizaciones</h4>
                            <ul className="filter-list">
                                <li><input type="checkbox" id="pers1" /><label htmlFor="pers1">Opción 1</label></li>
                                <li><input type="checkbox" id="pers2" /><label htmlFor="pers2">Opción 2</label></li>
                                <li><input type="checkbox" id="pers3" /><label htmlFor="pers3">Opción 3</label></li>
                                <li><input type="checkbox" id="pers4" /><label htmlFor="pers4">Opción 4</label></li>
                                <li><input type="checkbox" id="pers5" /><label htmlFor="pers5">Opción 5</label></li>
                            </ul>
                        </div>

                        <div className="filter-group">
                            <h4>Técnica de personalización</h4>
                            <ul className="filter-list">
                                <li><input type="checkbox" id="tech1" /><label htmlFor="tech1">Técnica 1</label></li>
                                <li><input type="checkbox" id="tech2" /><label htmlFor="tech2">Técnica 2</label></li>
                                <li><input type="checkbox" id="tech3" /><label htmlFor="tech3">Técnica 3</label></li>
                                <li><input type="checkbox" id="tech4" /><label htmlFor="tech4">Técnica 4</label></li>
                                <li><input type="checkbox" id="tech5" /><label htmlFor="tech5">Técnica 5</label></li>
                            </ul>
                        </div>

                        <div className="filter-group">
                            <h4>Cantidad mínima</h4>
                            <ul className="filter-list">
                                <li><input type="checkbox" id="qty1" /><label htmlFor="qty1">Cantidad 1</label></li>
                                <li><input type="checkbox" id="qty2" /><label htmlFor="qty2">Cantidad 2</label></li>
                                <li><input type="checkbox" id="qty3" /><label htmlFor="qty3">Cantidad 3</label></li>
                            </ul>
                        </div>

                        <div className="filter-group">
                            <h4>Etiquetas populares</h4>
                            <ul className="filter-list">
                                <li><input type="checkbox" id="tag1" /><label htmlFor="tag1">Etiqueta 1</label></li>
                                <li><input type="checkbox" id="tag2" /><label htmlFor="tag2">Etiqueta 2</label></li>
                                <li><input type="checkbox" id="tag3" /><label htmlFor="tag3">Etiqueta 3</label></li>
                            </ul>
                        </div>
                    </div>
                </aside>

                {/* Product Grid */}
                <main className="products-main">
                    {/* Sort Controls */}
                    <div className="sort-controls">
                        <div className="dropdown">
                            <span>Ordenar por: </span>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className="sort-select"
                            >
                                <option value="Destacados">Destacados</option>
                                <option value="Precio: menor a mayor">Precio: menor a mayor</option>
                                <option value="Precio: mayor a menor">Precio: mayor a menor</option>
                                <option value="A-Z">A-Z</option>
                                <option value="Z-A">Z-A</option>
                            </select>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="products-grid">
                        {productData.map((product, index) => (
                            <div className="product-card" key={index}>
                                <div className="product-image">
                                    {/* Placeholder for product image */}
                                </div>
                                <div className="product-info">
                                    <p className="product-title">{product.title}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>

            {/* Decorative Corner Elements */}
            <div className="top-left-decoration"></div>
            <div className="bottom-right-decoration"></div>
        </div>
    );
};

export default Products;