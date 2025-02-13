import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import axios from 'axios';

function Verificate() {
    const location = useLocation();
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL;

    const {id} = useParams();

    const verifyAccount = async () => {
        try {
            const response = await axios.post(`${API_URL}/verifyEmail`, { id });

            if (response.status === 200) {
                navigate('/auth/login');
            } else {
                setMessage('The account is already verified.');
            }
        } catch (error) {
            if (error.response && error.response.status === 409) {
                setMessage('The account is already verified.');
            } else {
                setMessage('An error occurred while verifying the account.');
            }
        }
    };

    useEffect(() => {
        verifyAccount();
    }, []);

    return (
        <div className="verification-container">
            <h1>Vérification de l'email</h1>
            <p>{message}</p>
        </div>
    );
}

export default Verificate;