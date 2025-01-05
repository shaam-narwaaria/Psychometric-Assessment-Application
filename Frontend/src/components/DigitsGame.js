import React, { useState, useEffect } from "react";
import axios from "axios";
import "./DigitsGame.css";

const DigitsGame = ({ userName, userEmail, setmovePages }) => {
    const [digitSequence, setDigitSequence] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isMemorizePhase, setIsMemorizePhase] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [level, setLevel] = useState(5); // Start level at 5 digits
    const [round, setRound] = useState(1); // Track the current round
    const [mistakes, setMistakes] = useState(0); // Track mistakes
    const [feedback, setFeedback] = useState(""); // Inline feedback
    const [currentDigitIndex, setCurrentDigitIndex] = useState(0); // Display digits one by one
    const [maxMemorizedDigits, setMaxMemorizedDigits] = useState(0); // Track max digits memorized
    const [gameStarted, setGameStarted] = useState(false);

    const maxRounds = 5;
    const maxMistakes = 3;

    const generateRandomDigits = (length) => {
        const digits = Array.from({ length }, () => Math.floor(Math.random() * 10));
        setDigitSequence(digits);
    };

    useEffect(() => {
        if (!gameStarted) return;

        generateRandomDigits(level);
        setUserInput("");
        setIsMemorizePhase(true);
        setCurrentDigitIndex(0);

        const interval = setInterval(() => {
            setCurrentDigitIndex((prevIndex) => {
                if (prevIndex < level - 1) {
                    return prevIndex + 1;
                } else {
                    clearInterval(interval);
                    setTimeout(() => setIsMemorizePhase(false), 1000);
                    return prevIndex;
                }
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [level, round, gameStarted]);

    const handleInputChange = (e) => {
        setUserInput(e.target.value);
    };

    const startGame = () => {
        setGameStarted(true);
    };

    const checkUserInput = () => {
        if (userInput === digitSequence.join("")) {
            setFeedback("Correct! Proceeding to the next level.");
            setRound((prevRound) => prevRound + 1);
            setLevel((prevLevel) => prevLevel + 1);
            setUserInput("");
            setMaxMemorizedDigits((prevMax) => Math.max(prevMax, level));

            if (round >= maxRounds) {
                setIsGameOver(true);
                saveScore(level * 10); // Calculate and save score only after 5 rounds
            } else {
                setIsMemorizePhase(true);
            }

        } else {
            const newMistakes = mistakes + 1;
            setMistakes(newMistakes);
            setLevel((prevLevel) => Math.max(prevLevel - 1, 1));

            setFeedback(`Incorrect! Mistake ${newMistakes} out of ${maxMistakes}`);
            setRound((prevRound) => prevRound + 1);

            if (newMistakes >= maxMistakes) {
                setIsGameOver(true);
                setFeedback("Game Over! Maximum mistakes reached.");
                saveScore(maxMemorizedDigits * 10); // Save score at the end, based on max memorized
            } else {
                setUserInput("");
                setIsMemorizePhase(true);
                setCurrentDigitIndex(0);
            }
        }
    };

    const saveScore = async (score) => {
        try {
            await axios.post("http://localhost:5000/api/scores", {
                gameName: "DigitGame",
                name: userName,
                email: userEmail,
                score: score,
                date: new Date(),
            });
            console.log("Score saved successfully.");
        } catch (error) {
            console.error("Error saving score:", error);
        }
    };

    const resetGame = () => {
        setLevel(5);
        setRound(1);
        setMistakes(0);
        setUserInput("");
        setFeedback("");
        setIsMemorizePhase(false);
        setIsGameOver(false);
        setMaxMemorizedDigits(0);
        setGameStarted(false);
    };

    return (
        <div className="digits-game-container">
            {!gameStarted ? (
                <div className="digits-start-screen">
                    <h2>Welcome to the Digits Memory Game!</h2>
                    <button
                        className="digits-start-button"
                        onClick={startGame}
                        disabled={gameStarted}
                    >
                        Start Game
                    </button>
                </div>
            ) : (
                <>
                    {isMemorizePhase && !isGameOver && (
                        <div className="digits-memorize-phase">
                            <h2>Memorize the digits!</h2>
                            <div className="digits-sequence">
                                {digitSequence.slice(0, currentDigitIndex + 1).map((digit, index) => (
                                    <span key={index} className="digits-digit">{digit}</span>
                                ))}
                            </div>
                            <p>Try to remember each number shown in sequence!</p>
                        </div>
                    )}

                    {!isMemorizePhase && !isGameOver && (
                        <div className="digits-input-section">
                            <h2>Round {round} - Enter the digits you memorized:</h2>
                            <input
                                type="text"
                                value={userInput}
                                onChange={handleInputChange}
                                placeholder="Enter digits"
                            />
                            <button onClick={checkUserInput}>Submit</button>
                            <p className="digits-feedback">{feedback}</p>
                            <p>Mistakes: {mistakes} / {maxMistakes}</p>
                        </div>
                    )}

                    {isGameOver && (
                        <div className="digits-game-over">
                            <h2>Game Over!</h2>
                            <div className="digits-summary-container">
                                <p>Maximum digits memorized: <span className="highlight">{maxMemorizedDigits}</span></p>
                                <p>Rounds completed: <span className="highlight">{round - 1}</span></p>
                                <p>Total mistakes: <span className="highlight">{mistakes}</span></p>
                            </div>
                            <p>{feedback}</p>
                            <div className="digits-button-container">
                                <button className="digits-restart-button" onClick={resetGame}>Try Again</button>
                                <button className="digits-restart-button" onClick={() => setmovePages(1)}>Back to Menu</button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default DigitsGame;
