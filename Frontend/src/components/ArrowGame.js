import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ArrowGame.css';

const ArrowGame = ({ userName, userEmail, setmovePages }) => {
    const [round, setRound] = useState(0);
    const [sequence, setSequence] = useState([]);
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [scoreSaved, setScoreSaved] = useState(false); // To track if the score has already been saved
    const totalRounds = 15;

    let inactivityTimer; // Variable to hold the inactivity timer

    const startGame = () => {
        setGameStarted(true);
        setRound(0);
        setScore(0);
        setGameOver(false);
        setScoreSaved(false); // Reset scoreSaved when a new game starts
        generateSequence();
    };

    const restartGame = () => {
        setGameStarted(true);
        setRound(0);
        setScore(0);
        setGameOver(false);
        setScoreSaved(false); // Reset scoreSaved when the game restarts
        generateSequence();
    };

    useEffect(() => {
        if (gameStarted && round < totalRounds) {
            generateSequence();
        } else if (round >= totalRounds && !scoreSaved) { // Only save score once
            setGameOver(true);
            saveScore(score);
            setScoreSaved(true); // Mark score as saved
        }

        // Clear inactivity timer when round or sequence changes
        clearTimeout(inactivityTimer);

        // Set the inactivity timer to automatically move to next round after 1.5 seconds
        inactivityTimer = setTimeout(() => {
            if (!gameOver && gameStarted) {
                setRound((prevRound) => prevRound + 1);
            }
        }, 1500); // 1.5 seconds of inactivity

        return () => {
            clearTimeout(inactivityTimer); // Cleanup on unmount or state change
        };
    }, [round, gameStarted, gameOver, scoreSaved]);

    const generateSequence = () => {
        const arrows = ['←', '→'];
        const colors = ['red', 'blue'];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const direction = arrows[Math.floor(Math.random() * arrows.length)];

        const seq = [];
        for (let i = 0; i < 5; i++) {
            const arrow = i === 2 ? (direction === '←' ? '→' : '←') : direction;
            seq.push({ arrow, color });
        }

        setSequence(seq);
    };

    const handleKeyPress = (event) => {
        if (!gameStarted || gameOver) return;

        const key = event.key;
        const correctArrow = sequence[round % 5]; // Gets the current correct arrow and color

        if (key === 'ArrowLeft' || key === 'ArrowRight') {
            let direction = key === 'ArrowLeft' ? '←' : '→';

            // Reverse direction if the arrow color is blue
            if (correctArrow.color === 'blue') {
                direction = direction === '←' ? '→' : '←';
            }

            // If the pressed key matches the arrow direction, add score
            if (correctArrow.arrow === direction) {
                setScore((prevScore) => prevScore + 10);
            } else {
                // If the pressed key is incorrect, subtract score (with an additional penalty if arrow color is blue)
                setScore((prevScore) => prevScore - 5);
            }

            // Move to the next round
            setRound((prevRound) => prevRound + 1);

            // Reset the inactivity timer since the player has responded
            clearTimeout(inactivityTimer);
        }
    };

    const saveScore = async (finalScore) => {
        try {
            const response = await axios.post('http://localhost:5000/api/scores', {
                gameName: 'ArrowGame',
                name: userName,
                email: userEmail,
                score: finalScore,
            });
            console.log('Score saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving score:', error);
        }
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [sequence, round, gameStarted, gameOver]);

    return (
        <div className="arrow-game">
            <h1 className="arrow-game-title">Arrow Game</h1>
            {!gameStarted ? (
                <button onClick={startGame} className="arrow-game-start-button">Start Game</button>
            ) : (
                <>
                    <h2 className="arrow-game-round">Round {round + 1} / {totalRounds}</h2>
                    <p className="arrow-game-score">Score: {score}</p>
                    {gameOver ? (
                        <div className="arrow-game-modal-overlay">
                            <div className="arrow-game-modal-content">
                                <p className="arrow-game-game-over-message">Game over! Your final score is {score}.</p>
                                <button onClick={restartGame} className="arrow-game-restart-button">Restart</button>
                                <button onClick={() => setmovePages(1)} className="arrow-game-menu-button">Go to Menu</button>
                            </div>
                        </div>
                    ) : (
                        <div className="arrow-game-sequence">
                            <div className="arrow-game-arrows">
                                {sequence.map((item, index) => (
                                    <span
                                        key={index}
                                        style={{ color: item.color }}
                                        className="arrow-game-arrow"
                                    >
                                        {item.arrow}
                                    </span>
                                ))}
                            </div>
                            <p className="arrow-game-instructions">Press the correct arrow key (← or →) based on the arrow sequence and color.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ArrowGame;
