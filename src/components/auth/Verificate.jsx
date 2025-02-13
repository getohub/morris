import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

function Verificate() {
    const location = useLocation();
    const [message, setMessage] = useState('Vérification en cours...');
    const [status, setStatus] = useState('loading');
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const {id} = useParams();

    useEffect(() => {
        const verifyAccount = async () => {
            try {
                const response = await axios.get(`${API_URL}/verifyEmail/${id}`);

                if (response.data.success) {
                    setStatus('success');
                    setMessage('Email vérifié avec succès! Redirection...');
                    setTimeout(() => {
                        navigate('/auth/login');
                    }, 3000);
                } else {
                    setStatus('error');
                    setMessage(response.data.error || 'Une erreur est survenue');
                }
            } catch (error) {
                setStatus('error');
                setMessage(error.response?.data?.error || 'Une erreur est survenue lors de la vérification');
            }
        };

        if (id) {
            verifyAccount();
        }
    }, [id, navigate, API_URL]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4">Vérification de l'email</h1>
                <div className={`text-center ${
                    status === 'success' ? 'text-green-600' : 
                    status === 'error' ? 'text-red-600' : 
                    'text-gray-600'
                }`}>
                    <p>{message}</p>
                    {status === 'error' && (
                        <button 
                            onClick={() => navigate('/auth/login')}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Retour à la connexion
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Verificate;