import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext.jsx';
import io from 'socket.io-client';
import MorrisGame from './MorrisGame.jsx';
import { jwtDecode } from 'jwt-decode';

const URL_FRONT = import.meta.env.VITE_URL_FRONT;
const API_URL = import.meta.env.VITE_API_URL;
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;

const socket = io(`${SOCKET_URL}`, {
  withCredentials: true,
  transports: ['websocket', 'polling'],
  transportOptions: {
    polling: {
      extraHeaders: {
        'Access-Control-Allow-Origin': URL_FRONT
      }
    }
  }
});

function PlayGame() {
  const navigate = useNavigate();
  const { gameId } = useParams();
  const query = new URLSearchParams(window.location.search);
  const role = query.get("role");
  const { user } = useContext(AuthContext);
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [players, setPlayers] = useState([]);
  const [isReady, setIsReady] = useState(false);

  const [gameStats, setGameStats] = useState({
    phase: 'waiting',
    piecesToPlace: { black: 9, white: 9 },
    capturedPieces: { black: 0, white: 0 }
  });

  const setGameState = (newState) => {
    setGameStats(prevStats => ({
      ...prevStats,
      phase: newState.phase || prevStats.phase,
      piecesToPlace: {
        black: newState.piecesToPlace?.black ?? prevStats.piecesToPlace.black,
        white: newState.piecesToPlace?.white ?? prevStats.piecesToPlace.white
      },
      capturedPieces: {
        black: newState.capturedPieces?.black ?? prevStats.capturedPieces.black,
        white: newState.capturedPieces?.white ?? prevStats.capturedPieces.white
      }
    }));
  };

  const toggleReady = () => {
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    socket.emit('setReady', {
      gameId,
      userId: user.id,
      isReady: newReadyState
    });
  };

  const requestEndGame = () => {
    setWantsToEnd(true);
    socket.emit('requestEndGame', { gameId, userId: user.id });
  };

  useEffect(() => {
    if (!user || !user.token) {
      setError('User not authenticated');
      return;
    }

    const fetchGame = async () => {
      try {
        const response = await fetch(`${API_URL}/game/${gameId}`, {
          headers: {
            'Authorization': `Bearer ${user.token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();
        const decodedToken = jwtDecode(user.token);
        if (data.error) {
          setError(data.error);
        } else {
          setGame(data);
          socket.emit("initGame", {
            gameId,
            userId: user.id,
            username: decodedToken.username,
            role,
            isCreator: data.creator === user.id,
            isReady: false
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Failed to fetch game');
      }
    };

    fetchGame();

    // Initialize socket listeners
    socket.on('playersUpdated', (updatedPlayers) => {
      const currentPlayer = updatedPlayers.find(p => p.id === user.id);
      if (currentPlayer) {
        setIsReady(currentPlayer.isReady);
      }
      setPlayers(updatedPlayers);
    });

    socket.on('gameStateUpdated', (newState) => {
      if (newState.gameOver) {
        setGameState(prev => ({
          ...prev,
          gameOver: true,
          winner: newState.winner,
          winnerScore: newState.winnerScore,
          board: newState.board
        }));
      } else {
        setGameState(newState);
      }
    });

    const handlePlayersUpdate = (updatedPlayers) => {
      const currentPlayer = updatedPlayers.find(p => p.id === user?.id);
      if (currentPlayer) {
        setIsReady(currentPlayer.isReady);
      }
      setPlayers(updatedPlayers);
    };

    const handleGameStart = () => {
      console.log('Game started!');
    };

    socket.on('playersUpdated', handlePlayersUpdate);
    socket.on('gameStart', handleGameStart);

    return () => {
      socket.off('playersUpdated', handlePlayersUpdate);
      socket.off('gameStart', handleGameStart);
      socket.off('gameStateUpdated');
    };
  }, [gameId, user, role]);

  socket.on('gameFinished', () => {
    navigate('/games/join');
  });

  const leaveGame = async () => {
    try {
    const response = await fetch(`${API_URL}/game/leave/${gameId}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${user.token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId: user.id })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (data.error) {
        setError(data.error);
      } else {
        navigate('/games/join');
      }
    } catch (error) {
      console.error('Error leaving game:', error);
      setError('Failed to leave game');
    }
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!game) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-2xl mb-4 font-bold text-gray-800 mb-">Nine Men's Morris</h2>
          <span className="text-sm text-gray-500">ID du jeu : <b>{gameId.substring(0, 8)}</b></span>
          <div className="flex justify-center items-center mt-4 mb-4">
            <p className="font-bold text-gray-800">Joueurs actuels</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map((player, index) => (
              <div key={index} className={`p-4 rounded-lg border ${player.role === 'X' ? 'bg-red-50 border-red-200' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className='w-full'>
                    <div className="text-lg font-medium text-gray-800">
                      {player.username}
                      {player.id === user.id && (
                        <span className="ml-2 text-sm bg-green-100 text-green-700 px-2 py-1 rounded">
                          (Vous)
                        </span>
                      )}
                      {player.isCreator && (
                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Hôte
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-600">
                      Joue avec les pièces : {player.isCreator ? 'noir' : 'blanc'}
                    </div>
                    <div className="mt-2">
                      {player.isReady ? (
                        <span className="text-green-600 font-medium">Prêt !</span>
                      ) : (
                        <span className="text-gray-500">Pas prêt</span>
                      )}
                    </div>
                    {/* to do => display all infos */}
                    {/* Game stats display */}
                    <div className="mt-2 text-sm text-gray-600">
                      <div className="bg-white p-3 rounded-lg shadow-sm">
                        <h4 className="font-medium mb-2">Stats du jeu : </h4>
                        <div className="space-y-1">
                          <p>Phase: {
                            gameStats.phase === 'placement' ? 'Placement' :
                              gameStats.phase === 'moving' ? 'Déplacement' :
                                gameStats.phase === 'waiting' ? 'En attente' :
                                  gameStats.phase || 'Inconnue'
                          }</p>
                          <p>Pièces noires : {
                            Math.min(9, Math.max(0, 9 - (gameStats.piecesToPlace?.black || 0)))
                          }/9</p>
                          <p>Pièces bleus : {
                            Math.min(9, Math.max(0, 9 - (gameStats.piecesToPlace?.white || 0)))
                          }/9</p>
                          <p>Capturé (Noir) : {gameStats.capturedPieces?.black || 0}</p>
                          <p>Capturé (Bleu): {gameStats.capturedPieces?.white || 0}</p>
                        </div>
                      </div>
                    </div>
                    {player.id === user.id && (
                      <button
                        onClick={toggleReady}
                        className={`px-4 py-1 m-2 rounded ${player.isReady
                          ? 'bg-green-500 hover:bg-green-600'
                          : 'bg-gray-500 hover:bg-gray-600'
                          } text-white transition`}
                      >
                        {player.isReady ? 'Prêt !' : 'Pas prêt ?'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {players.length === 1 && (
              <div className="p-4 rounded-lg bg-gray-50 border border-gray-200">
                <div className="flex items-center text-gray-600">
                  <svg className="animate-spin mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>En attente d'un autre joueur...</span>
                </div>
              </div>
            )}
          </div>
          <div>
            {/* to display the messages */}

          </div>
        </div>

        <MorrisGame
          gameId={gameId}
          role={role}
          players={players}
          onGameStateChange={(newState) => setGameState(newState)}
        />

        <div className="flex justify-center items-center mt-8">
          <button
            onClick={leaveGame}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition"
          >
            Quitter la partie
          </button>
        </div>
      </div>
    </div>
  );
}

export default PlayGame;