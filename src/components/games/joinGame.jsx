import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../auth/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

function joinGame() {
  const { user } = useContext(AuthContext);
  const [games, setGames] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetchGames = async () => {
    setIsLoading(true);
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Token not found');
        return;
      }

      const response = await fetch('http://localhost:3000/games', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des parties');
      }

      const data = await response.json();
      const gamesWithUsernames = await Promise.all(
        data
          .filter(game => game.state !== "finished" && !game.winner)
          .map(async (game) => {
            try {
              const creatorResponse = await fetch(`http://localhost:3000/users/${game.creator}`, {
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              });
              const creatorData = await creatorResponse.json();

              let playerData = null;
              if (game.player) {
                const playerResponse = await fetch(`http://localhost:3000/users/${game.player}`, {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                });
                playerData = await playerResponse.json();
              }

              return {
                ...game,
                creatorUsername: creatorData.username,
                playerUsername: playerData?.username
              };
            } catch (error) {
              console.error('Error fetching user data:', error);
              return game;
            }
          }));

        const finishedGames = data
          .filter(game => game.state === "finished" || game.winner)
          .map(game => ({
            ...game
        }));

      setGames([...gamesWithUsernames, ...finishedGames]);
      setError(null);
    } catch (error) {
      console.error('Error fetching games:', error);
      setError('Failed to fetch games. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const socket = io('http://localhost:3001');

    if (!user || !user.token) {
      setError('User not authenticated');
      return;
    }

    // Faire une requête initiale pour obtenir les parties
    const initialFetch = async () => {
      try {
        await fetchGames();
      } catch (error) {
        console.error('Error during initial fetch:', error);
        setError('Unable to fetch games');
      }
    };

    initialFetch();

    // Écouter les mises à jour des parties
    socket.on('gameCreated', async (newGame) => {
      try {
    
        // Utiliser la fonction setGames avec le state précédent
        setGames(prevGames => {
          // Vérifier si le jeu existe déjà
          const gameExists = prevGames.some(game => game.id === newGame.gameId);
          if (gameExists) {
            return prevGames;
          }

          // Ajouter le nouveau jeu à la liste existante
          return [...prevGames, newGame];
        });
      } catch (error) {
        console.error('Error handling new game:', error);
      }
    });

    socket.on('gameUpdated', (updatedGame) => {
      setGames(prevGames => 
        prevGames.map(game => 
          game.id === updatedGame.id ? updatedGame : game
        )
      );
    });

    socket.on('gameDeleted', (gameId) => {
      setGames(prevGames => 
        prevGames.filter(game => game.id !== gameId)
      );
    });

    return () => {
      socket.off('gameCreated');
      socket.off('gameUpdated');
      socket.off('gameDeleted');
      socket.disconnect();
    };
  }, [user?.token]);

  const fetchUserById = (userId) => {
    return fetch(`http://localhost:3000/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${user.token}`,
        'Content-Type': 'application/json'
      }
    })
      .then(async response => {
        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des users');
        }
        const userData = await response.json(); // Parse JSON once and store result
        return userData; // Return the parsed data
      })
      .catch(error => {
        console.error('Error fetching users:', error);
        setError(error.message);
      })
  };

  const createGame = async () => {
    if (!user || !user.token) {
      setError('User not authenticated');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/game', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: user.id
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error('Erreur lors de la création de la partie');
      }

      if (data.gameId) {
        navigate(`/games/play/${data.gameId}?role=black`);
      } else {
          throw new Error('No game ID received');
      }
      
    } catch (error) {
      console.error('Error creating game:', error);
      setError('Failed to create game');
    } finally {
      setIsLoading(false);
    }
  };

  const joinGame = async (gameId) => {
    try {
      // Vérifier si l'utilisateur est déjà le créateur de la partie
      const gameToJoin = games.find(game => game.id === gameId);
      if (gameToJoin.creator === user.id) {
        setError("Vous ne pouvez pas rejoindre votre propre partie !");
        return;
      }

      setIsLoading(true);
      setError(null);
      const response = await fetch(`http://localhost:3000/game/join/${gameId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la jointure de la partie');
      }

      const data = await response.json();
      navigate(`/games/play/${gameId}?role=white`);
    } catch (error) {
      console.error('Error joining game:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#242424' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">Parties disponibles</h1>
            <p className="mt-2 text-gray-300">Rejoignez une partie ou créez-en une nouvelle</p>
          </div>
          <div className='ml-8'>
            <button
              onClick={createGame}
              className="inline-flex items-center bg-indigo-600 hover:bg-indigo-700 
            text-white font-semibold rounded-lg shadow-sm transition-all duration-200 transform 
            hover:scale-105"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Créer une partie
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Nouvelles parties */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Parties en attente
            </h2>
            {games
              .filter(game => game.state === "pending" && !game.player)
              .map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  onJoin={() => joinGame(game.id)}
                  currentUser={user}
                  type="waiting"
                />
              ))}
          </div>

          {/* Parties en cours */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Parties en cours
            </h2>
            {games
              .filter(game =>
                game.state === "playing" &&
                !game.gameOver &&
                !game.winner &&
                game.player &&
                !game.finished
              )
              .map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  currentUser={user}
                  type="playing"
                />
              ))}
          </div>
          {/* Parties terminées */}
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Parties terminées
            </h2>
            {games
              .filter(game =>
                game.state === "finished" ||
                game.gameOver ||
                game.winner
              )
              .map(game => (
                <GameCard
                  key={game.id}
                  game={game}
                  currentUser={user}
                  type="finished"
                />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant GameCard pour afficher une partie
const GameCard = ({ game, onJoin, currentUser, type }) => {
  const navigate = useNavigate();
  const displayId = game?.id ? game.id.slice(0, 8) : 'ID non disponible';

  const cardStyle = {
    waiting: "border-green-500/30 hover:border-green-500/50 bg-green-900/20",
    playing: "border-blue-500/30 hover:border-blue-500/50 bg-blue-900/20",
    finished: "border-gray-500/30 hover:border-gray-500/50 bg-gray-900/20"
  };

  const isPlayerInGame = game.creator === currentUser.id || game.player === currentUser.id;
  const playerRole = game.creator === currentUser.id ? 'black' : 'white';

  const handleGameAccess = () => {
    if (type === "waiting") {
      onJoin();
    } else if (type === "playing" && isPlayerInGame) {
      navigate(`/games/play/${game.id}?role=${playerRole}`);
    }
  };

  return (
    <div className={`p-6 rounded-xl border-2 ${cardStyle[type]} transition-all duration-200`}>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-200">Partie #{displayId}</h3>
          <div className="mt-2 space-y-1">
            <p className="text-sm text-gray-300 text-left">
              <span className="font-medium">Créateur:</span> {game.creatorUsername}
              {game.creator === currentUser.id && (
                <span className="ml-2 text-xs bg-yellow-900/50 text-yellow-200 px-2 py-1 rounded-full">
                  (Vous)
                </span>
              )}
            </p>
            <p className="text-sm text-gray-300 text-left">
              <span className="font-medium">Joueur 2:</span> {game.playerUsername || "En attente"}
              {game.player === currentUser.id && (
                <span className="ml-2 text-xs bg-yellow-900/50 text-yellow-200 px-2 py-1 rounded-full">
                  (Vous)
                </span>
              )}
            </p>
            {type === "finished" && (
              <div className="mt-2">
                <p className="text-sm font-medium text-left">
                  <span className="text-gray-300">Gagnant : </span>
                  <span className={`${game.winner === currentUser.id ? 'text-green-400' : 'text-red-400'}`}>
                    {game.winner === game.creator ? game.creatorUsername : game.playerUsername}
                    {game.winner === currentUser.id && " (Vous)"}
                  </span>
                </p>
                {game.winnerScore && (
                  <p className="text-sm text-gray-300 text-left">
                    <span className="font-medium">Score final : </span>
                    {game.winnerScore} pièces restantes
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
        {(type === "waiting" && !game.player && game.creator !== currentUser.id) && (
          <button
            onClick={handleGameAccess}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 
            transition-colors duration-200 text-sm font-medium"
          >
            Rejoindre
          </button>
        )}
        {(type === "playing" && isPlayerInGame) && (
          <button
            onClick={handleGameAccess}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
            transition-colors duration-200 text-sm font-medium"
          >
            Reprendre
          </button>
        )}
      </div>
    </div>
  );
};

export default joinGame;