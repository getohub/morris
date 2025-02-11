import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext.jsx';

function AppNavigation() {
    const { isAuthenticated, logout, token } = useContext(AuthContext);

    return (
        
        <div className="navbar bg-base-100 fixed top-0 left-0 w-full z-10">
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
                        <li><Link to='/games/join'>Join</Link></li>
                    </ul>
                </div>
                <Link to="/" className="btn btn-ghost text-xl">Games</Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><Link to='/'>Accueil</Link></li>
                    <li><Link to='/games/new'>New game</Link></li>
                    <li><Link to='/games/join'>Join</Link></li>
                </ul>
            </div>
            <div className="navbar-end">
                <ul className="menu menu-horizontal px-1">
                    {isAuthenticated ? (    
                        <li>
                            <button onClick={logout} className='btn btn-ghost'>Se déconnecter</button>
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
