import React, { createContext, useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { jwtDecode } from "jwt-decode";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(() => localStorage.getItem('token') || null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        if (token) {
            try {
                const decodedToken = jwtDecode(token);

                // Vérification de l'expiration
                if (decodedToken.exp * 1000 < Date.now()) {
                    console.error('Token expiré');
                    logout();
                } else {
                    setUser({ id: decodedToken.id, token });
                    setIsAuthenticated(true);
                }

            } catch (error) {
                console.error('Token invalide');
                logout();
            }
        }
    }, [token]);

    const login = (userData) => {
        localStorage.setItem('token', userData.token);
        localStorage.setItem('userId', userData.id);
        localStorage.setItem('username', userData.username);
        setUser({
            id: userData.id,
            token: userData.token,
            username: userData.username
        });
        setIsAuthenticated(true);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
    };

    const setTokenValue = (value) => {
        localStorage.setItem("token", value);
        setToken(value);
    }

    const contextValue = useMemo(() => ({
        token,
        setTokenValue,
        user,
        login,
        logout,
        isAuthenticated
    }), [token, user, isAuthenticated]);

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};
AuthProvider.propTypes = {
    children: PropTypes.node.isRequired,
};

export default AuthProvider;