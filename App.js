// Importing the useState hook from React for state management
import { useState } from 'react';

// Square component for each individual square on the board
function Square({ value, onSquareClick }) {
  // Renders a button that displays the value ('X', 'O', or null) and responds to a click
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

// Board component represents the tic-tac-toe grid
function Board({ xIsNext, squares, onPlay }) {
  // Function to handle click on squares
  function handleClick(i) {
    // If there's a winner or square is already filled, return early
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    // Slice to copy the squares array for immutability
    const nextSquares = squares.slice();
    // Set the value of the square to 'X' or 'O' based on xIsNext
    nextSquares[i] = xIsNext ? 'X' : 'O';
    // Trigger the onPlay callback with the new squares
    onPlay(nextSquares);
  }

  // Determine the game status
  const winner = calculateWinner(squares);
  // Set the status message based on whether there's a winner
  let status = winner ? 'Winner: ' + winner : 'Next player: ' + (xIsNext ? 'X' : 'O');

  // Render the 3x3 board with status and squares
  return (
    <>
      <div className="status">{status}</div>
      {/* Render rows of squares */}
      {Array(3).fill(null).map((_, row) => (
        <div className="board-row" key={row}>
          {Array(3).fill(null).map((_, col) => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => handleClick(index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

// Game component to encapsulate the entire game logic
export default function Game() {
  // State for the history of moves
  const [history, setHistory] = useState([Array(9).fill(null)]);
  // State for the current move number
  const [currentMove, setCurrentMove] = useState(0);
  // Derived state to determine which player goes next
  const xIsNext = currentMove % 2 === 0;
  // Derived state for the current game board
  const currentSquares = history[currentMove];

  // Function to handle a new play
  function handlePlay(nextSquares) {
    // Slice history to ensure we don't include "future" moves after a new play
    const nextHistory = history.slice(0, currentMove + 1);
    // Add the new squares configuration to the history
    nextHistory.push(nextSquares);
    // Update history state
    setHistory(nextHistory);
    // Set the current move to the new latest move
    setCurrentMove(nextHistory.length - 1);
  }

  // Function to jump to a past move
  function jumpTo(nextMove) {
    // Set the current move to the selected move
    setCurrentMove(nextMove);
  }

  // Function to restart the game
  function handleRestart() {
    // Reset history
    setHistory([Array(9).fill(null)]);
    // Reset the move number
    setCurrentMove(0);
  }

  // Map the history of moves to render buttons for "time travel"
  const moves = history.map((_, move) => {
    // Description changes based on whether it's the start or a specific move
    const description = move ? 'Move #' + move : 'Game start';
    // Return a list item with a button for each move
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  // Render the game container with the board and the game info section
  return (
    <div className="game-container">
      <div className="game">
        <div className="game-header">
          <div className="game-title">Tic-Tac-Toe</div>
        </div>
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        <button className="restart-button" onClick={handleRestart}>Restart Game</button>
      </div>
      <div className="game-info">
        <div className="game-results-title">Game Results</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// Function to calculate the winner of the game
function calculateWinner(squares) {
  // Lines are the indexes of the squares that make a win
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  // Loop through the lines to see if any line has the same value
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    // Check if the squares have the same value and are not null
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // Return the winner ('X' or 'O')
      return squares[a];
    }
  }
  // If no winner, return null
  return null;
}
