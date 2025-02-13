import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';

const API_URL = import.meta.env.VITE_API_URL;

function Home() {
  const { user } = useContext(AuthContext);

  const navigate = useNavigate();

  const createGame = async () => {
    if (!user) {
      navigate('/auth/login');
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
        console.error(data.error);
      } else {
        // Redirection vers la nouvelle partie avec le rôle "black" pour le créateur
        navigate(`/games/play/${data.gameId}?role=black`);
      }
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        {/* Section d'accueil */}
        {user && (
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Bienvenue {user.username} sur Moulitric !
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Découvrez le jeu du Moulin et affrontez d'autres joueurs
            </p>
          </div>
        )}

        {/* Introduction */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Le Jeu du Moulin</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Le Jeu du Moulin est un jeu de stratégie classique où deux joueurs s'affrontent
              sur un plateau avec pour objectif de former des alignements de trois pions
              et de capturer les pions adverses.
            </p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Commencer à jouer</h2>
            <div className="space-y-4">
              <button
                onClick={createGame} 
                className="block text-center p-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 rounded-lg text-white transition duration-200 w-full"
              >
                Créer une nouvelle partie
              </button>
                <Link to="/games/join" 
                className="block text-center p-4 bg-green-600 hover:bg-green-700 dark:bg-green-500 dark:hover:bg-green-600 rounded-lg text-white transition duration-200"
              >
                  Rejoindre une partie
                </Link>
            </div>
          </div>
        </div>

        {/* Règles du jeu */}
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm mb-16">
          <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6">Règles du jeu</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">Phase 1: Placement</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Chaque joueur place à tour de rôle ses 9 pions sur les intersections vides du plateau.
                Former un "moulin" (3 pions alignés) permet de capturer un pion adverse.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400">Phase 2: Déplacement</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Une fois tous les pions placés, les joueurs déplacent leurs pions vers une intersection
                adjacente libre pour former des moulins.
              </p>
            </div>
            
            <div className="space-y-3">
              <h3 className="text-xl font-semibold text-purple-600 dark:text-purple-400">Phase 3: Vol</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quand un joueur n'a plus que 3 pions, il peut "voler" vers n'importe quelle
                intersection libre du plateau.
              </p>
            </div>
          </div>
        </div>

        {/* État des parties */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-green-200 dark:border-green-900 shadow-sm">
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400 mb-3">
              Parties en attente
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Parcourez la liste des parties disponibles et rejoignez d'autres joueurs.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-blue-200 dark:border-blue-900 shadow-sm">
            <h3 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-3">
              Parties en cours
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Vous pouvez reprendre votre partie en cours.
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-3">
              Parties terminées
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Consultez l'historique des parties terminées et leurs résultats.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;