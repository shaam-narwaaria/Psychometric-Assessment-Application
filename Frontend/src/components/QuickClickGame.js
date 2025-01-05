import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './QuickClickGame.css'; // Add a CSS file for styling

const QuickClickGame = ({ userName, userEmail, setmovePages }) => {
    const [showTarget, setShowTarget] = useState(false);
    const [reactionTime, setReactionTime] = useState(null);
    const [startTime, setStartTime] = useState(null);
    const [averageTime, setAverageTime] = useState(0);
    const [rounds, setRounds] = useState([]);
    const [statusMessage, setStatusMessage] = useState('Press "Start" to begin!');
    const [targetPosition, setTargetPosition] = useState({ top: '50%', left: '50%' });
    const totalRounds = 5;

    useEffect(() => {
        // Calculate and save average time after the final round
        if (rounds.length === totalRounds) {
            const avgTime = rounds.reduce((a, b) => a + b, 0) / rounds.length;
            setAverageTime(avgTime.toFixed(2));
            saveScore(avgTime);
        }
    }, [rounds]);

    const startNewRound = () => {
        // Reset states and start a countdown
        setShowTarget(false);
        setReactionTime(null);
        setStatusMessage('Get Ready...');
        setTargetPosition({ top: '50%', left: '50%' }); // Reset position

        setTimeout(() => {
            setStatusMessage('Wait for it...');
            setTimeout(() => {
                // Randomize target position
                const newTop = Math.random() * 80 + 10 + '%';
                const newLeft = Math.random() * 80 + 10 + '%';
                setTargetPosition({ top: newTop, left: newLeft });

                setShowTarget(true);
                setStartTime(Date.now());
                setStatusMessage('Click Now!');
            }, Math.random() * 2000 + 1000); // Random delay between 1 and 3 seconds
        }, 1000); // 1-second countdown before random delay
    };

    const handleClick = () => {
        if (showTarget) {
            const time = (Date.now() - startTime) / 1000;
            setReactionTime(time);
            setRounds([...rounds, time]);
            setShowTarget(false);
            setStatusMessage(`Good! Reaction Time: ${time.toFixed(2)}s`);
            new Audio('/sounds/correct.mp3').play(); // Play sound on correct click
        } else {
            setStatusMessage('Too soon! Wait for the target to appear.');
            new Audio('/sounds/error.mp3').play(); // Play sound on error click
        }
    };

    const saveScore = async (avgTime) => {
        // Save the score and rounds to the backend
        await axios.post('http://localhost:5000/api/scores', {
            gameName: 'QuickClick',
            name: userName,
            email: userEmail,
            score: avgTime*10,
            rounds: rounds,
        });
    };

    const restartGame = () => {
        // Reset all game states for a new game
        setRounds([]);
        setReactionTime(null);
        setStatusMessage('Press "Start" to begin!');
        setAverageTime(0);
        setShowTarget(false);
        setTargetPosition({ top: '50%', left: '50%' });
    };

    return (
        <div className="quick-click-game">
            <h2 className="quick-click-game__title">Quick Click Game</h2>
            <div className="quick-click-game__info">
                <p>{statusMessage}</p>
                {rounds.length < totalRounds ? (
                    <div>
                        <button className="quick-click-game__button" onClick={startNewRound} disabled={showTarget}>
                            {showTarget ? 'Target Active' : 'Start Round'}
                        </button>
                        {showTarget && (
                            <div
                                className="quick-click-game__target"
                                style={{
                                    top: targetPosition.top,
                                    left: targetPosition.left,
                                }}
                                onClick={handleClick}
                            >
                                🎯
                            </div>
                        )}
                        {reactionTime && (
                            <p className="quick-click-game__reaction-time">Your Reaction Time: {reactionTime.toFixed(2)} seconds</p>
                        )}
                    </div>
                ) : (
                    <div>
                        <p className="quick-click-game__game-over">Game Over! Your Average Reaction Time: {averageTime} seconds</p>
                        <button className="quick-click-game__button" onClick={() => setmovePages(1)}>Return to Home</button>
                        <button className="quick-click-game__button" onClick={restartGame}>Restart Game</button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default QuickClickGame;
