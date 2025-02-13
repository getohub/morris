import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext.jsx';
import { ThemeContext } from '../../contexts/ThemeContext.jsx';

function AppNavigation() {
    const { isAuthenticated, logout, token } = useContext(AuthContext);
    const { darkMode, toggleDarkMode } = useContext(ThemeContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/auth/login');
    };

    return (
        <div className="navbar bg-white dark:bg-gray-800 shadow-md fixed top-0 left-0 w-full z-10">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                        <li><Link to='/'>Accueil</Link></li>
                        <li><Link to='/games/new'>New game</Link></li>
                        <li><Link to='/games/join'>Rejoindre</Link></li>
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl">Moulitric</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to='/'>Accueil</Link></li>
                    <li><Link to='/games/new'>New game</Link></li>
                    <li><Link to='/games/join'>Rejoindre</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <button 
                    onClick={toggleDarkMode}
                    className="btn btn-ghost btn-circle mr-2"
                    aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
                >
                    {darkMode ? (
                        <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"/>
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"/>
                        </svg>
                    )}
                </button>
                <ul className="menu menu-horizontal px-1">
                    {isAuthenticated ? (    
                        <li>
                            <button onClick={handleLogout} className='btn btn-ghost'>Se déconnecter</button>
                        </li>
                    ) : (
                        <li>
                            <details>
                                <summary>Authentification</summary>
                                <ul className="">
                                    <li><Link to='/auth/login'>Se connecter</Link></li>
                                    <li><Link to='/auth/signup'>S'inscrire</Link></li>
                                </ul>
                            </details>
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default AppNavigation;
