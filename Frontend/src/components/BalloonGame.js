import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './BalloonGame.css';

const BalloonGame = ({ userName, userEmail, setmovePages }) => {
    const [round, setRound] = useState(0);
    const [pumps, setPumps] = useState(0);
    const [size, setSize] = useState(150);
    const [total, setTotal] = useState(0);
    const [exploded, setExploded] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    const startSize = 150;
    const increase = 8;
    const roundsPlayed = 6;
    const explodeArray = [5, 10, 23, 13, 1, 20];

    const labelBalance = 'Total Balance:';
    const labelCurrency = ' Taler';
    const labelHeader = 'Balloon Game Round ';
    // const msgEnd = `This part of the study is complete. You earned ${total} Taler.`;

    useEffect(() => {
        if (round >= roundsPlayed) {
            setGameOver(true);
            saveScore(total);
        }
    }, [round]);

    useEffect(() => {
        if (exploded && !gameOver) {
            setTimeout(() => newRound(), 1000);
        }
    }, [exploded, gameOver]);

    const newRound = () => {
        if (gameOver) return;
        setRound(prevRound => prevRound + 1);
        setPumps(0);
        setSize(startSize);
        setExploded(false);
        playSound('/sounds/newRound.mp3');
    };

    const handlePump = () => {
        if (gameOver || exploded) return;

        const newPumps = pumps + 1;
        const newSize = size + increase;
        setPumps(newPumps);
        setSize(newSize);

        playSound('/sounds/pump.mp3');

        if (newPumps >= explodeArray[round]) {
            setExploded(true);
            playSound('/sounds/explode.mp3');
        }
    };

    const handleCollect = () => {
        if (pumps === 0) return;

        const totalEarned = exploded ? 0 : pumps;
        setTotal(prevTotal => prevTotal + totalEarned);
        playSound(exploded ? '/sounds/explode.mp3' : '/sounds/collect.mp3');

        newRound();
    };

    const saveScore = async (score) => {
        try {
            await axios.post('http://localhost:5000/api/scores', {
                gameName: 'BalloonGame',
                name: userName,
                email: userEmail,
                score: score,
            });
            console.log('Score saved successfully');
        } catch (error) {
            console.error('Error saving score:', error);
        }
    };

    const resetGame = () => {
        setRound(0);
        setPumps(0);
        setSize(startSize);
        setTotal(0);
        setExploded(false);
        setGameOver(false);
    };

    const playSound = (soundPath) => {
        const audio = new Audio(soundPath);
        audio.play();
    };

    return (
        <div className="balloon-game">
            {/* Only show the game header if the game is not over */}
            {!gameOver && (
                <div className="balloon-game-header">
                    <h1>{labelHeader}{round + 1} / {roundsPlayed}</h1>
                </div>
            )}

            {!gameOver && (
                <>
                    <div className="balloon-game-container">
                        <div
                            id="balloon"
                            key={round}
                            className={`balloon-game-balloon ${exploded ? 'burst' : ''}`}
                            style={{ width: `${size}px`, height: `${size}px` }}
                        ></div>
                    </div>

                    <div className="balloon-game-info balloon-game-centered">
                        <p>{labelBalance} {total}{labelCurrency}</p>
                        <p>{exploded ? 'Balloon exploded!' : `Potential Earnings: ${pumps} Taler`}</p>
                        <div className="balloon-game-button-container">
                            <button className="balloon-game-btn" onClick={handlePump} disabled={exploded}>Increase Pressure</button>
                            <button className="balloon-game-btn balloon-game-collect" onClick={handleCollect} disabled={exploded}>Collect Money</button>
                        </div>
                    </div>
                </>
            )}

            {gameOver && (
                <div className="balloon-game-modal-overlay">
                    <div className="balloon-game-modal-content">
                        <p>Your Total Score: {total} {labelCurrency}</p>
                        <button className="balloon-game-play-again-button" onClick={resetGame}>Play Again</button>
                        <button className="balloon-game-go-back-button" onClick={() => setmovePages(1)}>Back to Menu</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BalloonGame;
