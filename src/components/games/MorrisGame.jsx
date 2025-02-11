import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from '../auth/AuthContext.jsx';
import io from "socket.io-client";
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const socket = io(`${SOCKET_URL}`, {
  withCredentials: true,
  transportOptions: {
      polling: {
          extraHeaders: {
              "Access-Control-Allow-Origin": "*"
          }
      }
  }
});

const MorrisGame = ({ gameId, role, players, onGameStateChange }) => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [gameState, setGameState] = useState({
    board: Array(24).fill(null),
    currentPlayer: "black",
    phase: "placement",
    selectedPiece: null,
    millFormed: false,
    piecesToPlace: { black: 9, white: 9 },
    piecesPlaced: { black: 0, white: 0 },
    capturedPieces: { black: 0, white: 0 },
    winner: null,
    winnerScore: null,
    isMyTurn: role === "black",
    flyingPhase: { black: false, white: false },
    validMoves: [],
    message: null,
    lastMove: null,
    gameOver: false
  });

  // Définition des connexions possibles sur le plateau
  const connections = {
    0: [1, 9], 1: [0, 2, 4], 2: [1, 14],
    3: [4, 10], 4: [1, 3, 5, 7], 5: [4, 13],
    6: [7, 11], 7: [4, 6, 8], 8: [7, 12],
    9: [0, 10, 21], 10: [3, 9, 11, 18], 11: [6, 10, 15],
    12: [8, 13, 17], 13: [5, 12, 14, 20], 14: [2, 13, 23],
    15: [11, 16], 16: [15, 17, 19], 17: [12, 16],
    18: [10, 19], 19: [16, 18, 20, 22], 20: [13, 19],
    21: [9, 22], 22: [19, 21, 23], 23: [14, 22]
  };

  // Définition des moulins possibles
  const mills = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], [15, 16, 17],
    [18, 19, 20], [21, 22, 23], [0, 9, 21], [3, 10, 18],
    [6, 11, 15], [8, 12, 17], [5, 13, 20], [2, 14, 23],
    [1, 4, 7], [9, 10, 11], [12, 13, 14], [19, 22, 16]
  ];

  // Positions des points sur le plateau
  const positions = [
    { x: 0, y: 0 }, { x: 3, y: 0 }, { x: 6, y: 0 },
    { x: 1, y: 1 }, { x: 3, y: 1 }, { x: 5, y: 1 },
    { x: 2, y: 2 }, { x: 3, y: 2 }, { x: 4, y: 2 },
    { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 2, y: 3 },
    { x: 4, y: 3 }, { x: 5, y: 3 }, { x: 6, y: 3 },
    { x: 2, y: 4 }, { x: 3, y: 4 }, { x: 4, y: 4 },
    { x: 1, y: 5 }, { x: 3, y: 5 }, { x: 5, y: 5 },
    { x: 0, y: 6 }, { x: 3, y: 6 }, { x: 6, y: 6 }
  ];

  // Listen for game state updates
  const handleGameStateUpdate = (newState) => {
    if (!newState || !newState.board) return;

    const isMyTurn = role === newState.currentPlayer;
    const contextualMessage = getContextualMessage(newState, isMyTurn, role);

    // Check if this update contains a winner
    if (newState.winner) {
      // Only the creator makes the API call 
      const winnerScore = newState.board.filter(piece => piece === newState.winner).length;
      const winnerId = newState.players.find(p => p.role === newState.winner)?.id;

      // Make API call to save game result
      fetch(`${API_URL}/game/${gameId}/finish`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          winner: winnerId,
          winnerScore: winnerScore
        })
      }).catch(error => console.error('Error saving game result:', error));
    }

    onGameStateChange({
      phase: newState.phase,
      piecesToPlace: newState.piecesToPlace,
      capturedPieces: newState.capturedPieces
    });

    setGameState(prevState => ({
      ...prevState,
      ...newState,
      currentPlayer: newState.currentPlayer,
      isMyTurn,
      selectedPiece: null,
      validMoves: [],
      message: contextualMessage,
      gameOver: !!newState.winner,
      players: players
    }));
  };

  useEffect(() => {
    socket.on('gameStateUpdated', handleGameStateUpdate);

    // Join game room
    socket.emit('initGame', {
      gameId,
      userId: user.id,
      role,
      username: user.username,
      isCreator: role === 'black'
    });

    return () => {
      socket.off('gameStateUpdated', handleGameStateUpdate);
    };
  }, []);

  const getContextualMessage = (state, isMyTurn, playerRole) => {

    if (state.players.length !== 2) {
      return "En attente d'un autre joueur...";
    }
    else if (state.players.length === 2 && !state.players[0].isReady && !state.players[1].isReady) {
      return "Soyez prêt !";
    }

    if (state.winner) {
      return state.winner === playerRole ? "Vous avez gagné !" : "Vous avez perdu !";
    }

    if (state.millFormed) {
      return isMyTurn
        ? "Moulin formé ! Sélectionnez une pièce adverse à capturer."
        : "On va vous récupérer une pièce";
    }

    return isMyTurn ? "C'est votre tour" : "Ce n'est pas votre tour";
  };

  const handleClick = (position) => {
    if (gameState.gameOver) {
      showMessage("La partie est terminée !");
      return;
    }

    if (!gameState.isMyTurn) {
      showMessage("Ce n'est pas votre tour");
      return;
    }

    // Vérifie si on peut déplacer les pièces
    if (gameState.phase === 'moving') {
      if (gameState.piecesPlaced.black < 9 || gameState.piecesPlaced.white < 9) {
        showMessage("Attendez que toutes les pièces soient placées");
        return;
      }
    }

    switch (gameState.phase) {
      case "placement":
        handlePlacementPhase(position);
        break;
      case "moving":
        handleMovingPhase(position);
        break;
      case "removing":
        handleRemovingPhase(position);
        break;
    }
  };

  const handlePlacementPhase = (position) => {
    if (gameState.board[position] !== null) {
      showMessage("Cette position est déjà occupée");
      return;
    }

    const newBoard = [...gameState.board];
    newBoard[position] = gameState.currentPlayer;

    const millFormed = checkForMill(newBoard, position);

    // Mise à jour des compteurs de pièces placées
    const newPiecesPlaced = {
      ...gameState.piecesPlaced,
      [gameState.currentPlayer]: gameState.piecesPlaced[gameState.currentPlayer] + 1
    };

    const newPiecesToPlace = {
      ...gameState.piecesToPlace,
      [gameState.currentPlayer]: gameState.piecesToPlace[gameState.currentPlayer] - 1
    };

    const allPiecesPlaced = newPiecesPlaced.black === 9 && newPiecesPlaced.white === 9;

    const updatedState = {
      ...gameState,
      board: newBoard,
      piecesPlaced: newPiecesPlaced,
      piecesToPlace: newPiecesToPlace,
      phase: millFormed ? 'removing' : gameState.phase,
      currentPlayer: millFormed ? gameState.currentPlayer : getOpponent(),
      millFormed,
      message: getPhaseMessage(millFormed, newPiecesToPlace[gameState.currentPlayer], allPiecesPlaced)
    };

    // Si toutes les pièces sont placées, on passe en phase de déplacement
    if (allPiecesPlaced && !millFormed) {
      updatedState.phase = 'moving';
      updatedState.message = "Phase de déplacement activée.";
    }

    emitGameState(updatedState);
  };

  const handleMovingPhase = (position) => {
    const isFlying = countPlayerPieces(gameState.currentPlayer) === 3;

    // Handling piece selection
    if (gameState.selectedPiece === null) {
      if (gameState.board[position] !== gameState.currentPlayer) {
        showMessage("Sélectionnez une de vos pièces");
        return;
      }

      const validMoves = getValidMoves(position, isFlying);
      if (validMoves.length === 0) {
        showMessage("Cette pièce n'a aucun mouvement possible");
        return;
      }

      setGameState(prev => ({
        ...prev,
        selectedPiece: position,
        validMoves: validMoves,
        message: "Sélectionnez une destination"
      }));
      return;
    }

    // Handling piece movement
    if (position === gameState.selectedPiece) {
      // Deselect piece
      setGameState(prev => ({
        ...prev,
        selectedPiece: null,
        validMoves: [],
        message: null
      }));
      return;
    }

    if (!gameState.validMoves.includes(position)) {
      showMessage("Mouvement invalide");
      return;
    }

    const newBoard = [...gameState.board];
    newBoard[position] = gameState.currentPlayer;
    newBoard[gameState.selectedPiece] = null;

    const millFormed = checkForMill(newBoard, position);

    const updatedState = {
      ...gameState,
      board: newBoard,
      selectedPiece: null,
      validMoves: [],
      phase: millFormed ? 'removing' : 'moving',
      currentPlayer: millFormed ? gameState.currentPlayer : getOpponent(),
      millFormed,
      message: millFormed ? "Moulin formé ! Capturez une pièce adverse" : null,
      lastMove: position
    };

    emitGameState(updatedState);
  };

  const handleRemovingPhase = (position) => {
    const opponent = getOpponent();
    if (!canCapturePiece(position, opponent)) {
      showMessage("Cette pièce ne peut pas être capturée");
      return;
    }

    const newBoard = [...gameState.board];
    newBoard[position] = null;

    const newCapturedPieces = {
      ...gameState.capturedPieces,
      [gameState.currentPlayer]: gameState.capturedPieces[gameState.currentPlayer] + 1
    };

    // On vérifie si le joueur a encore des pièces à placer
    const isStillInPlacementPhase =
      gameState.piecesPlaced.black < 9 ||
      gameState.piecesPlaced.white < 9;

    // Vérifie si le joueur a perdu (moins de 3 pièces et plus de pièces à placer)
    const remainingPieces = countPlayerPieces(opponent);
    const hasPiecesToPlace = gameState.piecesToPlace[opponent] > 0;
    const winner = (remainingPieces < 4 && !hasPiecesToPlace) ? gameState.currentPlayer : null;

    const updatedState = {
      ...gameState,
      board: newBoard,
      phase: isStillInPlacementPhase ? 'placement' : 'moving',
      currentPlayer: opponent,
      millFormed: false,
      capturedPieces: newCapturedPieces,
      winner,
      winnerScore: winner ? countPlayerPieces(winner) : null,
      message: winner
        ? `${winner === role ? 'Vous avez gagné' : 'Vous avez perdu'} !`
        : isStillInPlacementPhase
          ? `Phase de placement : ${gameState.piecesToPlace[opponent]} pièces restantes.`
          : null,
      gameOver: !!winner
    };

    emitGameState(updatedState);
  };

  const getPhaseMessage = (millFormed, remainingPieces, allPiecesPlaced) => {
    if (millFormed) {
      return "Moulin formé ! Capturez une pièce adverse";
    }
    if (allPiecesPlaced) {
      return "Phase de déplacement activée.";
    }
    return `Phase de placement : ${remainingPieces} pièces restantes.`;
  };

  // Helper functions
  const getOpponent = () => gameState.currentPlayer === 'black' ? 'white' : 'black';

  const countPlayerPieces = (player) =>
    gameState.board.filter(piece => piece === player).length;

  const showMessage = (message) => {
    setGameState(prev => ({ ...prev, message }));
    setTimeout(() => setGameState(prev => ({ ...prev, message: null })), 3000);
  };

  const getValidMoves = (position, isFlying) => {
    if (isFlying) {
      return gameState.board
        .map((piece, index) => piece === null ? index : -1)
        .filter(index => index !== -1);
    }
    return connections[position].filter(pos => gameState.board[pos] === null);
  };

  const checkForMill = (board, position) => {
    return mills.some(mill => {
      if (mill.includes(position)) {
        return mill.every(pos => board[pos] === gameState.currentPlayer);
      }
      return false;
    });
  };

  const canCapturePiece = (position, player) => {
    if (gameState.board[position] !== player) return false;

    const isInMill = checkForMill(gameState.board, position);
    const hasNonMillPieces = gameState.board.every((piece, pos) =>
      piece === player && !checkForMill(gameState.board, pos)
    );

    // Allow capturing from mill if all opponent's pieces are in mills
    return !isInMill || !hasNonMillPieces;
  };

  const emitGameState = (newState) => {
    socket.emit('updateGameState', {
      gameId,
      ...newState,
      phase: newState.phase,
      piecesToPlace: newState.piecesToPlace,
      capturedPieces: newState.capturedPieces
    });
  };

  const handleReturnToList = () => {
    // No need to make another API call, just navigate
    navigate('/games/join');
  };

  // Render board
  return (
    <div className="flex flex-col md:flex-row gap-8 p-6 bg-gray-100">
      <div className="relative w-[600px] h-[600px] rounded-lg shadow-lg p-4">

        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 600 600">

          {/* Board lines */}
          {Object.entries(connections).map(([pos, connectedPos]) =>
            connectedPos.map(target => (
              <line
                key={`${pos}-${target}`}
                x1={positions[parseInt(pos)].x * 100}
                y1={positions[parseInt(pos)].y * 100}
                x2={positions[target].x * 100}
                y2={positions[target].y * 100}
                className={`
                  stroke-gray-400 transition-all duration-300
                  ${gameState.validMoves?.includes(parseInt(target)) ? 'stroke-blue-500 stroke-2' : ''}
                `}
                strokeWidth="4"
              />
            ))
          )}
        </svg>

        {/* Game points */}
        {positions.map((pos, index) => (
          <button
            key={index}
            onClick={() => handleClick(index)}
            disabled={!gameState.isMyTurn || gameState.gameOver}
            className={`
              absolute w-12 h-12 rounded-full transform -translate-x-1/2 -translate-y-1/2
              transition-all duration-300 shadow-md
              ${getPointStyle(index)}
            `}
            style={{
              left: `${pos.x * 100}px`,
              top: `${pos.y * 100}px`
            }}
          />
        ))}
      </div>

      {/* Message de statut du jeu */}
      {gameState.phase === 'moving' && gameState.selectedPiece !== null && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg animate-bounce" style={{ top: 6 + 'em' }}>
          Sélectionnez une position pour déplacer votre pièce
        </div>
      )}

      {/* Game messages */}
      {gameState.message && (
        <div className="absolute top-4 right-4 bg-blue-500 text-white px-4 py-2 rounded shadow-lg animate-bounce" style={{ top: 6 + 'em' }}>
          {gameState.message}
        </div>
      )}

      {/* Victory/Defeat Modal */}
      {gameState.gameOver && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-sm w-full mx-4 text-center">
            <h2 className={`text-2xl font-bold mb-4 ${gameState.winner === role ? 'text-green-600' : 'text-red-600'
              }`}>
              {gameState.winner === role ? 'Victoire !' : 'Défaite !'}
            </h2>
            <p className="text-gray-600 mb-6">
              {gameState.winner === role
                ? 'Félicitations, vous avez gagné la partie !'
                : 'Dommage, vous avez perdu la partie.'}
            </p>
            <button
              onClick={handleReturnToList}
              className={`px-6 py-2 rounded-lg text-white font-semibold transition-colors ${gameState.winner === role
                  ? 'bg-green-500 hover:bg-green-600'
                  : 'bg-red-500 hover:bg-red-600'
                }`}
            >
              Retourner à la liste des parties
            </button>
          </div>
        </div>
      )}
    </div>
  );

  function getPointStyle(index) {
    const baseStyle = "hover:scale-110 ";

    if (gameState.selectedPiece === index) {
      return baseStyle + "bg-red-500 ring-4 ring-red-300";
    }

    if (gameState.validMoves?.includes(index)) {
      return baseStyle + "bg-blue-200 animate-pulse";
    }

    if (gameState.board[index] === 'black') {
      return baseStyle + "bg-black";
    }

    if (gameState.board[index] === 'white') {
      return baseStyle + "bg-blue-500 border-2";
    }

    return baseStyle + "bg-gray-200 hover:bg-gray-300";
  }
};

MorrisGame.propTypes = {
  gameId: PropTypes.string.isRequired,
  role: PropTypes.oneOf(['black', 'white']).isRequired,
  players: PropTypes.array.isRequired,
  onGameStateChange: PropTypes.func.isRequired
};

export default MorrisGame;