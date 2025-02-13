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
        <div className="bg-gray-50 dark:bg-gray-900 py-12">
            <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-lg">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white sm:text-3xl">
                            {heading}
                        </h1>
                        <p className="mt-4 text-gray-500 dark:text-gray-400">
                            Connectez-vous pour jouer !
                        </p>
                    </div>

                    {errorMessage && (
                        <div className="mt-4 text-center text-red-500 bg-red-50 dark:bg-red-900/10 p-3 rounded-lg">
                            {errorMessage}
                        </div>
                    )}

                    <form onSubmit={formik.handleSubmit} className="mt-8 mb-0 space-y-4 bg-white dark:bg-gray-800 p-8 shadow-lg rounded-lg">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Votre mail"
                                    onChange={formik.handleChange}
                                    value={formik.values.email}
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 
                                    bg-white dark:bg-gray-900 p-4 pe-12 text-sm shadow-sm
                                    text-gray-900 dark:text-white
                                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-400"
                                />
                                {formik.errors.email && (
                                    <div className="mt-1 text-red-500 text-sm">
                                        {formik.errors.email}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                                Mot de passe
                        </label>
                        <div className="relative">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    placeholder="Mot de passe"
                                    onChange={formik.handleChange}
                                    value={formik.values.password}
                                    className="w-full rounded-lg border border-gray-200 dark:border-gray-700 
                                    bg-white dark:bg-gray-900 p-4 pe-12 text-sm shadow-sm
                                    text-gray-900 dark:text-white
                                    focus:border-blue-500 focus:ring-1 focus:ring-blue-500 dark:focus:border-blue-400"
                                />
                                {formik.errors.password && (
                                    <div className="mt-1 text-red-500 text-sm">
                                        {formik.errors.password}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                <span className="mr-2">Pas de compte ?</span>
                                <Link to="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                                    S'inscrire
                                </Link>
                            </p>
                        </div>
                        <div className="flex flex-col space-y-4">
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white
                                transition-colors duration-200
                                hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
                            >
                                Se connecter
                            </button>
                            <Link
                                to="/"
                                className="text-center text-sm font-medium text-blue-600 hover:text-blue-500
                                dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                Retour à l'accueil
                            </Link>
                            </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default LoginForm;