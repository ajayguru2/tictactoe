import React, { useState, useEffect } from 'react';
import Board from './Board';
import './styles.css';

const App = () => {
    const [history, setHistory] = useState([{ squares: Array(9).fill(null) }]);
    const [stepNumber, setStepNumber] = useState(0);
    const [probabilities, setProbabilities] = useState({ X: 50, O: 50 });
    const xIsNext = stepNumber % 2 === 0;

    const calculateProbabilities = (squares) => {
        if (calculateWinner(squares)) {
            const winner = calculateWinner(squares);
            return winner === 'X' ? { X: 100, O: 0 } : { X: 0, O: 100 };
        }

        // Count potential winning lines for each player
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6],
        ];

        let xPotential = 0;
        let oPotential = 0;

        lines.forEach(line => {
            const [a, b, c] = line;
            const lineSquares = [squares[a], squares[b], squares[c]];
            
            // Count lines with potential for X
            if (!lineSquares.includes('O')) {
                xPotential += lineSquares.filter(s => s === 'X').length + 1;
            }
            
            // Count lines with potential for O
            if (!lineSquares.includes('X')) {
                oPotential += lineSquares.filter(s => s === 'O').length + 1;
            }
        });

        const total = xPotential + oPotential;
        if (total === 0) return { X: 50, O: 50 };

        const xProb = Math.round((xPotential / total) * 100);
        return {
            X: xProb,
            O: 100 - xProb
        };
    };

    useEffect(() => {
        const currentSquares = history[stepNumber].squares;
        setProbabilities(calculateProbabilities(currentSquares));
    }, [history, stepNumber]);

    const handleClick = (i) => {
        const current = history[stepNumber];
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) return;
        squares[i] = xIsNext ? 'X' : 'O';
        setHistory(history.concat([{ squares }]));
        setStepNumber(history.length);
    };

    const jumpTo = (step) => {
        setStepNumber(step);
    };

    const resetGame = () => {
        setHistory([{ squares: Array(9).fill(null) }]);
        setStepNumber(0);
        setProbabilities({ X: 50, O: 50 });
    };

    const winner = calculateWinner(history[stepNumber].squares);
    const status = winner ? `Winner: ${winner}` : null;

    return (
        <div className="app-container">
            <h1 className="game-title">
                <span className="title-x">TIC</span>
                <span className="title-dash">TAC</span>
                <span className="title-o">TOE</span>
            </h1>
            <div className="game-container">
                <div className="probability-bar-container">
                    <div className="player-label x-label">Player X</div>
                    <div className="probability-bar">
                        <div 
                            className="x-probability" 
                            style={{ width: `${probabilities.X}%` }}
                        >
                            {probabilities.X > 0 ? `${probabilities.X}%` : ''}
                        </div>
                        <div 
                            className="o-probability"
                            style={{ width: `${probabilities.O}%` }}
                        >
                            {probabilities.O > 0 ? `${probabilities.O}%` : ''}
                        </div>
                    </div>
                    <div className="player-label o-label">Player O</div>
                </div>
                <div className="game">
                    <div className="game-board">
                        <div className={`turn-indicator ${xIsNext ? 'x-turn' : 'o-turn'}`}>
                            {winner && <div className="status">{status}</div>}
                        </div>
                        <Board squares={history[stepNumber].squares} onClick={handleClick} />
                        <button className="reset-button" onClick={resetGame}>Reset Game</button>
                    </div>
                    <div className="game-info">
                        <div className="moves-list">
                            {history.map((_, move) => {
                                const desc = move ? `Go to move #${move}` : 'Go to game start';
                                return (
                                    <button 
                                        key={move} 
                                        className="move-button"
                                        onClick={() => jumpTo(move)}
                                    >
                                        {desc}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

export default App;
