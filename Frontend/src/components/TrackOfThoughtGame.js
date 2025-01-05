import React, { useEffect, useState } from "react";
import axios from "axios";
import "./TrackOfThoughtGame.css";

const TrackOfThoughtGame = ({ userName, userEmail, setmovePages }) => {
    const [balls, setBalls] = useState([]);
    const [score, setScore] = useState(0);
    const [message, setMessage] = useState("");
    const [gameOver, setGameOver] = useState(false);
    const [ballTracks, setBallTracks] = useState({});
    const [gameInProgress, setGameInProgress] = useState(false);
    const [ballCount, setBallCount] = useState(0); // Track ball count
    const BALLS_PER_GAME = 10;

    const colors = ["red", "blue", "green", "yellow"];
    const sources = [
        { left: 50, top: 50 },
        { left: 150, top: 50 },
        { left: 250, top: 50 },
        { left: 350, top: 50 }
    ];
    const destinations = {
        red: { left: 50, top: 400 },
        blue: { left: 150, top: 400 },
        green: { left: 250, top: 400 },
        yellow: { left: 350, top: 400 }
    };

    const generateBall = () => {
        if (ballCount >= BALLS_PER_GAME || !gameInProgress) return;

        const id = Math.random().toString(36).substr(2, 9);
        const color = colors[Math.floor(Math.random() * colors.length)];
        const sourceIndex = Math.floor(Math.random() * sources.length);
        const ball = {
            id,
            color,
            source: sources[sourceIndex],
            position: sources[sourceIndex].top,
            target: destinations[color],
            moving: true
        };

        setBalls((prevBalls) => [...prevBalls, ball]);
        setBallTracks((prevTracks) => ({
            ...prevTracks,
            [id]: { track: "", position: sources[sourceIndex].top, left: sources[sourceIndex].left }
        }));
        setBallCount((prevCount) => prevCount + 1); // Increment ball count
    };

    const updateBallPositions = () => {
        if (!gameInProgress) return;

        setBalls((prevBalls) =>
            prevBalls.map((ball) => {
                const currentTrack = ballTracks[ball.id]?.track;
                const newTop = ball.position + 2; // Ball falls down slowly

                setBallTracks((prevTracks) => ({
                    ...prevTracks,
                    [ball.id]: { ...prevTracks[ball.id], position: newTop }
                }));

                // When ball reaches destination
                if (newTop >= destinations[ball.color].top) {
                    // Check if the ball is in the correct track
                    if (currentTrack === ball.color) {
                        setScore((prevScore) => prevScore + 10); // Increase score if correct
                        setMessage(`Correct! ${ball.color} ball reached its correct destination.`);
                    } else {
                        setMessage(`Incorrect. ${ball.color} ball missed the correct destination.`);
                    }
                    return { ...ball, moving: false, position: newTop };
                }

                return { ...ball, position: newTop };
            }).filter((ball) => ball.position < destinations[ball.color].top || ball.moving)
        );

        // End the game if all balls have reached their destination
        if (balls.length === BALLS_PER_GAME && balls.every((ball) => ball.position >= destinations[ball.color].top)) {
            endGame();
        }
    };



    const moveBall = (id, direction) => {
        if (!gameInProgress) return;

        setBallTracks((prevTracks) => {
            const currentLeft = prevTracks[id]?.left;
            if (currentLeft !== undefined) {
                const newLeft = direction === "left" ? Math.max(currentLeft - 100, 50) : Math.min(currentLeft + 100, 350);
                const newTrack = colors[Math.floor((newLeft - 50) / 100)];

                return {
                    ...prevTracks,
                    [id]: { ...prevTracks[id], left: newLeft, track: newTrack }
                };
            }
            return prevTracks;
        });
    };

    const endGame = () => {
        setGameOver(true);
        setGameInProgress(false);
        saveScore(score);
        setMessage(`Game Over! Final score: ${score}`);
    };

    const saveScore = async (finalScore) => {
        try {
            await axios.post("http://localhost:5000/api/scores", {
                gameName: "Track of Thought",
                name: userName,
                email: userEmail,
                score: finalScore
            });
        } catch (error) {
            console.error("Failed to save score:", error);
        }
    };

    useEffect(() => {
        let ballGenerator, positionUpdater;

        if (gameInProgress) {
            // Start generating balls only if ballCount is less than BALLS_PER_GAME
            ballGenerator = setInterval(() => {
                if (ballCount < BALLS_PER_GAME) {
                    generateBall();
                }
            }, 3000);

            positionUpdater = setInterval(updateBallPositions, 150);
        }

        return () => {
            clearInterval(ballGenerator);
            clearInterval(positionUpdater);
        };
    }, [gameInProgress, ballCount]); // Track `ballCount` instead of `balls.length`

    const startGame = () => {
        setGameInProgress(true);
        setBalls([]);
        setBallCount(0); // Reset ball count
        setScore(0);
        setBallTracks({});
        setGameOver(false);
        setMessage("Game started! Direct balls to the correct destinations.");
    };

    return (
        <div className="game-container">
            <div className="score-display">
                Score: {score}
            </div>
            <div className="message">{message}</div>
            <div className="game-area">
                <div className="source-row">
                    {sources.map((source, index) => (
                        <div
                            key={index}
                            className="source"
                            style={{ left: source.left, position: "absolute", top: source.top }}
                        >
                            Source
                        </div>
                    ))}
                </div>
                {balls.map((ball) => (
                    <div
                        key={ball.id}
                        className="ball"
                        style={{
                            backgroundColor: ball.color,
                            top: ballTracks[ball.id]?.position || ball.position,
                            left: ballTracks[ball.id]?.left || ball.source.left,
                            position: "absolute"
                        }}
                    >
                        <button onClick={() => moveBall(ball.id, "left")}>←</button>
                        <button onClick={() => moveBall(ball.id, "right")}>→</button>
                    </div>
                ))}
                <div className="destination-row">
                    {Object.entries(destinations).map(([color, pos]) => (
                        <div
                            key={color}
                            className="destination"
                            style={{ left: pos.left, position: "absolute", top: pos.top }}
                        >
                            {color}
                        </div>
                    ))}
                </div>
            </div>

            {!gameInProgress && !gameOver && (
                <button onClick={startGame}>Start Game</button>
            )}

            {gameOver && (
                <div className="game-over">
                    <button onClick={startGame}>Play Again</button>
                </div>
            )}

            <button className="back-button" onClick={() => setmovePages(1)}>Back</button>
        </div>
    );
};

export default TrackOfThoughtGame;
