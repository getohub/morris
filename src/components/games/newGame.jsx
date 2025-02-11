import React, { useState, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

function newGame() {
  const { user } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const createGame = async () => {
    if (!user || !user.token) {
      setError('User not authenticated');
      return;
    }

    try {
      const response = await fetch(`${API_URL}/game`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      if (data.error) {
        setError(data.error);
      } else {
        navigate(`/games/play/${data.gameId}?role=black`);
      }
    } catch (error) {
      console.error('Error creating game:', error);
      setError('Failed to create game');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            Créer une nouvelle partie
          </h1>
          <p className="text-xl text-gray-300">
            Commencez une nouvelle aventure dans le Jeu du Moulin
          </p>
        </div>

        {/* Informations sur la partie */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="bg-gray-800/50 p-8 rounded-lg border border-indigo-500/30">
            <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
              Informations de la partie
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Vous serez le joueur noir (premier joueur)
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                La partie commencera dès qu'un autre joueur la rejoindra
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 mr-2 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Vous pourrez placer 9 pions sur le plateau
              </li>
            </ul>
          </div>

          <div className="bg-gray-800/50 p-8 rounded-lg border border-indigo-500/30">
            <h2 className="text-2xl font-semibold text-indigo-400 mb-4">
              Rappel des règles
            </h2>
            <ul className="space-y-4 text-gray-300">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                Placez vos pions sur les intersections vides
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                Formez des alignements de 3 pions pour capturer les pions adverses
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                Le gagnant est celui qui bloque tous les pions adverses ou capture suffisamment de pions
              </li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col items-center space-y-4">
          {error && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 px-4 py-2 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="flex space-x-4">
            <button
              onClick={createGame}
              className={`px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg 
                transition-all duration-200 transform hover:scale-105 flex items-center
                `}
            >
              Créer une partie
            </button>

            <Link
              to="/games/join"
              className="px-8 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg 
                transition-all duration-200 flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
              </svg>
              Retour à la liste
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default newGame;