import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

function Verificate() {
    const location = useLocation();
    const [message, setMessage] = useState('Vérification en cours...');
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const {id} = useParams();

    const verifyAccount = async () => {
        try {
            const response = await axios.get(`${API_URL}/verifyEmail/${id}`);

            if (response.status === 200) {
                setMessage('Email vérifié avec succès! Redirection...');
                setTimeout(() => {
                    navigate('/auth/login');
                }, 2000);
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setMessage('Lien de vérification invalide.');
            } else {
                setMessage('Une erreur est survenue lors de la vérification.');
            }
        }
    };

    useEffect(() => {
        verifyAccount();
    }, [id, navigate, API_URL]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
                <h1 className="text-2xl font-bold text-center mb-4">Vérification de l'email</h1>
                <p className="text-center text-gray-600">{message}</p>
            </div>
        </div>
    );
}

export default Verificate;