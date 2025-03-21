import React, { useState } from 'react';
import './dashboardp.css';
import { CircleUserRound,ChartNoAxesCombined, Search, BellRing, BookOpenText } from "lucide-react";

// Definición de tipos
interface SessionData {
    source: string;
    sessions: number;
    change: string;
}

interface ChatUser {
    name: string;
    email: string;
}

const App: React.FC = () => {
    // Datos de ejemplo (estos serían reemplazados por datos reales)
    const [sessionData, setSessionData] = useState<SessionData[]>([
        { source: 'website.net', sessions: 4321, change: '+84%' },
        { source: 'website.net', sessions: 4033, change: '-8%' },
        { source: 'website.net', sessions: 3128, change: '+2%' },
        { source: 'website.net', sessions: 2104, change: '+33%' },
        { source: 'website.net', sessions: 2003, change: '+30%' },
        { source: 'website.net', sessions: 1894, change: '+15%' },
        { source: 'website.net', sessions: 405, change: '-12%' },
    ]);

    const [chatUsers, setChatUsers] = useState<ChatUser[]>([
        { name: 'Helena', email: 'email@figmasfakedomain.net' },
        { name: 'Oscar', email: 'email@figmasfakedomain.net' },
        { name: 'Daniel', email: 'email@figmasfakedomain.net' },
        { name: 'Daniel Jay Park', email: 'email@figmasfakedomain.net' },
        { name: 'Mark Rojas', email: 'email@figmasfakedomain.net' },
    ]);

    return (
        <div className="app-container">
            <div className="sidebar">
                {/* Aquí irá el logo de la empresa */}
                <div className="logo-container">
                    <div className="logo">
                        {/* Logo se agregará aquí */}
                    </div>
                    <span>Sesa Promo</span>
                </div>

                <div className="sidebar-section">
                    <h3>Discover</h3>
                    <div className="sidebar-item active">
                        <BookOpenText size={20} color={"#444444"}/>
                        <span>Resumen</span>
                    </div>
                    <div className="sidebar-item">
                        <ChartNoAxesCombined size={24} color="#444444"/>
                        <span>Estadísticas</span>
                    </div>
                </div>
                {/* Logo de usuario */}
                <div className="sidebar-footer">
                    <div className="sidebar-item">
                        <CircleUserRound size={24} color="#444444" />
                        <span>Admin</span>
                    </div>
                </div>
            </div>

            <div className="main-content">
                <div className="header">
                    <div className="search-bar">
                        <Search  size={20} color={"#444444"}/>
                        <input type="text" placeholder="Buscar..." />
                    </div>
                    <div className="notifications">
                        <BellRing size={20} color={"#444444"}/>
                    </div>
                </div>

                <div className="greeting-section">
                    <h1>¡Buenos días!</h1>
                    <p>Lo que está pasando:</p>
                </div>

                <div className="stats-cards">
                    <div className="stat-card">
                        <h3>Ganancias</h3>
                        <h2>$0</h2>
                        <p className="increase">+20% más que el mes pasado</p>
                    </div>

                    <div className="stat-card">
                        <h3>Stock</h3>
                        <h2>0</h2>
                        <p className="increase">+33% más que el mes pasado</p>
                    </div>

                    <div className="stat-card">
                        <h3>Ventas totales</h3>
                        <h2>0</h2>
                        <p className="decrease">-8% menos que el mes pasado</p>
                    </div>
                </div>

                <div className="dashboard-sections">
                    <div className="sessions-section">
                        <h3>Promedio de ventas</h3>
                        <table className="sessions-table">
                            <thead>
                            <tr>
                                <th>Fuente</th>
                                <th>Sesiones</th>
                                <th>Cambio</th>
                            </tr>
                            </thead>
                            <tbody>
                            {sessionData.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.source}</td>
                                    <td>{item.sessions}</td>
                                    <td className={item.change.includes('+') ? 'increase' : 'decrease'}>
                                        {item.change}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="chats-section">
                        <h3>Chats recientes</h3>
                        <div className="chat-list">
                            {chatUsers.map((user, index) => (
                                <div className="chat-item" key={index}>
                                    <div className="user-avatar">
                                        {/* Avatar del usuario se agregará aquí */}
                                    </div>
                                    <div className="user-info">
                                        <h4>{user.name}</h4>
                                        <p>{user.email}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;