import React, { useContext } from 'react';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import logo from '../../assets/moulitric.png';
import { useLocation } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext.jsx';

const AuthLayout = () => {
    const { isAuthenticated } = useContext(AuthContext);
    const [isLogin, setIsLogin] = React.useState(true);
    
    const toggleForm = () => {
        setIsLogin((prevState) => !prevState);
    };

    return (
        <div className="layout">
            <div className="logo-container text-center">
                <img src={logo} alt="Moulitric" className="logo mx-auto w-1/2 h-1/5" />
            </div>
            <div className="form-container mt-8">
                {useLocation().pathname === '/auth/login' ? <LoginForm /> : <SignUpForm />}

            </div>
        </div>
    );
};

export default AuthLayout;