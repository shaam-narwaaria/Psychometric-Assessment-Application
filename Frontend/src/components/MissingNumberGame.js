import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MissingNumberGame.css';

const MissingNumberGame = ({ userName, userEmail, setmovePages }) => {
    const [round, setRound] = useState(0);
    const [sequence, setSequence] = useState([]);
    const [missingNumber, setMissingNumber] = useState(null);
    const [userGuess, setUserGuess] = useState('');
    const [score, setScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const roundsPlayed = 5;

    // Effect to handle rounds and game logic
    useEffect(() => {
        if (round < roundsPlayed) {
            generateSequence();
        } else {
            setGameOver(true);
            saveScore(score);
        }
    }, [round]);

    // Function to generate the sequence with a missing number
    const generateSequence = () => {
        const length = 5 + round;
        const start = Math.floor(Math.random() * 10) + 1;
        const step = Math.floor(Math.random() * 5) + 1;
        const fullSequence = Array.from({ length }, (_, i) => start + i * step);

        const missingIndex = Math.floor(Math.random() * length);
        const newSequence = [...fullSequence];
        setMissingNumber(newSequence[missingIndex]);
        newSequence[missingIndex] = '?';
        setSequence(newSequence);
    };

    // Handle the guess made by the user
    const handleGuess = () => {
        const guess = parseInt(userGuess);
        if (isNaN(guess)) {
            alert('Please enter a valid number!');
            return;
        }
        if (guess === missingNumber) {
            setScore((prevScore) => prevScore + 10);
        }
        setUserGuess('');
        setRound((prevRound) => prevRound + 1);
    };

    // Save the score to the server
    const saveScore = async (finalScore) => {
        try {
            const response = await axios.post('http://localhost:5000/api/scores', {
                gameName: 'MissingNumber',
                name: userName,
                email: userEmail,
                score: finalScore,
            });
            console.log('Score saved successfully:', response.data);
        } catch (error) {
            console.error('Error saving score:', error);
        }
    };

    // Reset the game
    const resetGame = () => {
        setRound(0);
        setScore(0);
        setGameOver(false);
    };

    // Return to the main menu (handled by parent)
    const goToMenu = () => {
        setmovePages(1); // Navigate to menu (parent component should handle the logic)
    };

    return (
        <div className="miss-missing-number-game">
            <h1 className="miss-game-title">Missing Number Game</h1>
            <div className="miss-game-container">
                <div className="miss-game-info">
                    <p className="miss-input-container">Score: {score}</p>
                    {gameOver ? (
                        <div className="miss-game-over-info">
                            <p className="miss-game-over-message">Game over! Your final score is {score}.</p>
                            <button className="miss-restart-button" onClick={resetGame}>Restart</button>
                            <button className="miss-menu-button" onClick={goToMenu}>Go to Menu</button>
                        </div>
                    ) : (
                        <>
                            <p className="miss-sequence-text">Sequence: {sequence.join(' ')}</p>
                            <div className="miss-input-container">
                                <input
                                    type="number"
                                    value={userGuess}
                                    onChange={(e) => setUserGuess(e.target.value)}
                                    placeholder="Enter missing number"
                                    className="miss-guess-input"
                                />
                                <button onClick={handleGuess} className="miss-submit-button">Submit Guess</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MissingNumberGame;
