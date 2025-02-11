import './../../App.css';
import React, { useState, useContext } from 'react';
import * as Yup from 'yup';
import axios from 'axios';
import { useFormik } from 'formik';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;
const heading = "Se connecter";

const validationSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Required'),
    password: Yup.string().min(6, 'Password too short').required('Required'),
});

function LoginForm() {
    const navigate = useNavigate();
    const { setTokenValue } = useContext(AuthContext);
    const [errorMessage, setErrorMessage] = useState('');

    const formik = useFormik({
        initialValues: {
            email: '',
            password: '',
        },
        validationSchema: validationSchema,
        onSubmit: async (values) => {
            try {
                const response = await axios.post(`${API_URL}/login`, values);
                if (response.data.token) {
                    setTokenValue(response.data.token);
                    navigate('/');
                } else if (response.data.error === 'Incorrect password') {
                    setErrorMessage('Incorrect password');
                } else {
                    setErrorMessage('Login failed');
                }
            } catch (error) {
                console.error('Erreur lors de la connexion', error);
                alert('Erreur lors de la connexion');
            }
        },
    });

    return (
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-lg text-center">
                <h1 className="text-2xl font-bold sm:text-3xl">{heading}</h1>
                <p className="mt-4 text-gray-500">
                    Connectez-vous pour jouer !
                </p>
            </div>
            {errorMessage && <div className="text-red-500">{errorMessage}</div>}
            <form onSubmit={formik.handleSubmit} className="mx-auto mb-0 mt-8 max-w-md space-y-4">
                <div>
                    <label htmlFor="email" className="sr-only">Email</label>
                    <div className="relative">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Votre mail"
                            onChange={formik.handleChange}
                            value={formik.values.email}
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        />
                        {formik.errors.email && <div className="text-red-500 text-sm">{formik.errors.email}</div>}
                    </div>
                </div>
                <div>
                    <label htmlFor="password" className="sr-only">Mot de passe</label>
                    <div className="relative">
                        <input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="Mot de passe"
                            onChange={formik.handleChange}
                            value={formik.values.password}
                            className="w-full rounded-lg border-gray-200 p-4 pe-12 text-sm shadow-sm"
                        />
                        {formik.errors.password && <div className="text-red-500 text-sm">{formik.errors.password}</div>}
                    </div>
                </div>
                <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-500 w-full">
                        Pas de compte ? 
                        <Link to="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                            S'inscrire
                        </Link>
                    </p>                    
                </div>
                <div>
                    <button type="submit" className="inline-block rounded-lg bg-blue-500 px-5 py-3 text-sm font-medium text-white w-full">
                        Se connecter
                    </button>
                    <Link to="/" className='font-medium text-blue-600 hover:text-blue-500'>Retour à l'accueil</Link>
                </div>
            </form>
        </div>
    );
}

export default LoginForm;