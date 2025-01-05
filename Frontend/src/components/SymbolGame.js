import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './SymbolGame.css';

const symbols = ["⭐", "🌙", "🔥", "💧", "🍀", "💎"]; // Sample symbols

const SymbolGame = (props) => {
  const { userName, userEmail, setmovePages } = props;

  const [symbolGrid, setSymbolGrid] = useState([]);
  const [targetSymbol, setTargetSymbol] = useState("");
  const [count, setCount] = useState(0);
  const [userCount, setUserCount] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(null);
  const [round, setRound] = useState(1);
  const [totalScore, setTotalScore] = useState(0);
  const [roundScores, setRoundScores] = useState([]);

  const rows = 3;
  const columns = 7;
  const totalSymbols = rows * columns;

  useEffect(() => {
    startNewGame();
  }, [round]);

  const startNewGame = () => {
    const newGrid = Array.from({ length: totalSymbols }, () => symbols[Math.floor(Math.random() * symbols.length)]);
    const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
    const symbolCount = newGrid.filter(symbol => symbol === randomSymbol).length;

    setSymbolGrid(newGrid);
    setTargetSymbol(randomSymbol);
    setCount(symbolCount);
    setUserCount("");
    setGameOver(false);
    setScore(null);
    setStartTime(Date.now());
  };

  const calculateScore = (responseTime, correctCount) => {
    if (correctCount) {
      if (responseTime <= 1) return 100;
      if (responseTime <= 4) return 90;
      if (responseTime <= 6) return 80;
      if (responseTime <= 8) return 70;
      if (responseTime <= 10) return 60;
      if (responseTime <= 12) return 50;
      if (responseTime <= 14) return 40;
      if (responseTime <= 16) return 30;
      return 20;
    }
    return 0; // No points if incorrect
  };

  const handleSubmit = async () => {
    const responseTime = (Date.now() - startTime) / 1000; // in seconds
    const correctCount = parseInt(userCount) === count;
    const calculatedScore = calculateScore(responseTime, correctCount);

    setScore(calculatedScore);
    setRoundScores(prevScores => [...prevScores, calculatedScore]);

    setTotalScore(prevTotal => prevTotal + calculatedScore);

    if (round < 5) {
      setRound(round + 1);
    } else {
      setGameOver(true);
      await saveScores();
    }
  };

  const saveScores = async () => {
    const responseTime = (Date.now() - startTime) / 1000; // Calculate the response time in seconds
    try {
      await axios.post('http://localhost:5000/api/scores', {
        gameName: "SymbolCounter",
        name: userName,
        email: userEmail,
        score: totalScore,
        responseSymbolTime: responseTime,
      });
      console.log('Score saved successfully');
    } catch (error) {
      console.error('Error saving score:', error);
    }
  };

  return (
    <div className="container-symbol">
      <div className="symbol-game">
        <h2 className="h2-symbolheading">Symbol Counting Game</h2>
        {/* <div className="game-rounds-symbol">
          <p>Round {round} of 5</p>
        </div> */}
        {gameOver ? (
          <div className="results result-symbolcount">
            <h3>Your Total Score: {totalScore}</h3>
            <p>You've completed 5 rounds!</p>
            <div>
              <button onClick={() => setmovePages(2)} className="btn btn-secondary-symbol">Play Again</button>
              <button onClick={() => setmovePages(1)} className="btn btn-primary-symbol">Go to Menu</button>
            </div>
          </div>
        ) : (
          <div>
            <p className="count-paragraph-symbol">Count the number of "{targetSymbol}" symbols</p>
            <div className="symbol-grid-symbol">
              {symbolGrid.map((symbol, index) => (
                <span key={index} className="symbol-symbol">{symbol}</span>
              ))}
            </div>

            <div className="input-container-symbol">
              <input
                className="form-control-symbol"
                type="number"
                placeholder="Your Count"
                value={userCount}
                onChange={(e) => setUserCount(e.target.value)}
              />
              <button onClick={handleSubmit} className="btn-submit-symbol">Submit</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SymbolGame;
