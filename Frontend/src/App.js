import React, { useEffect, useState } from "react";
import axios from "axios";
import SymbolGame from "./components/SymbolGame";
import ArrowGame from "./components/ArrowGame";
import StarSearchGame from "./components/StarSearchGame";
import Home from "./components/Home";
import QuickClickGame from "./components/QuickClickGame";
import MissingNumberGame from "./components/MissingNumberGame";
import TrackOfThoughtGame from "./components/TrackOfThoughtGame";
import Navbar from "./components/Navbar";
import UserProfile from "./components/UserProfile";
import BalloonGame from "./components/BalloonGame";
import './App.css';
import { NavLink } from "react-router-dom";
import DigitsGame from "./components/DigitsGame";
import InstructionsPage from "./components/InstructionsPage";


function App() {
  const [movePages, setmovePages] = useState(0);
  const [userName, setuserName] = useState("");
  const [userEmail, setuserEmail] = useState("");
  const [error, setError] = useState("");
  const [localName, setlocalName] = useState("");
  const [localEmail, setlocalEmail] = useState("");

  const localToUsername = async () => {
    if (userName && userEmail) {
      await axios.post("http://localhost:5000/api/register", {
        name: userName,
        email: userEmail,
      });

      localStorage.setItem("game_username", JSON.stringify(userName));
      localStorage.setItem("game_useremail", JSON.stringify(userEmail));
      setError("");
      setmovePages(1);

      setTimeout(() => {
        setuserName("");
        setuserEmail("");
      }, 2000);
    } else {
      setError("*Fill fields properly");
    }
  };

  const thoughtWebApi = async () => {
    if (localName) {
      await axios.post("http://localhost:5000/api/scores", {
        gameName: "thoughtgame",
        name: localName,
        email: localEmail,
        score: Math.floor(Math.random() * 25),
      });
    }
  };

  const openPinballApi = async () => {
    if (localName) {
      await axios.post("http://localhost:5000/api/scores", {
        gameName: "pinballcounter",
        name: localName,
        email: localEmail,
        score: Math.floor(Math.random() * 40),
      });
    }
  };

  useEffect(() => {
    const game_name = JSON.parse(localStorage.getItem("game_username"));
    const game_email = JSON.parse(localStorage.getItem("game_useremail"));
    setlocalName(game_name);
    setlocalEmail(game_email);

    if (!game_name || !game_email) {
      setmovePages(0);
    }
  }, [userName]);

  return (
    <div>
      <Navbar
        localName={localName}
        userEmail={localEmail}
        setmovePages={setmovePages}
        movePages={movePages}
      />

      {/* Render Login Page if User is Not Logged In */}
      {/* {movePages === 0 && (
        <div className="app-login-container">
          <div className="app-login-box">
            <h2 className="app-login-header">Welcome!</h2>
            <input
              type="text"
              className="app-input-field"
              onChange={(e) => setuserName(e.target.value)}
              value={userName}
              placeholder="Enter your name"
            />
            <input
              type="email"
              className="app-input-field"
              onChange={(e) => setuserEmail(e.target.value)}
              value={userEmail}
              placeholder="Enter your email"
            />
            <button className="app-login-button" onClick={localToUsername}>
              Save
            </button>
            {error && <p className="app-error-message">{error}</p>}
          </div>
        </div>
      )} */}

      {/* Render Home Component */}
      {movePages === 0 && <Home setmovePages={setmovePages} />}

      {/* Render Games Section */}
      {movePages === 1 && (
        <div className="app-container">
          <h1 className="app-game-title"> Explore Our Game </h1>

          <div className="app-row">
            <div className="app-col-12">
              <div className="app-game-grid">

                <div className="app-game-card" onClick={() => setmovePages(2)}>
                  <div className="app-game-image">
                    <img src="/symbol.jpg" alt="Symbol Speedster Game" />
                  </div>
                  <div className="app-game-name">Symbol Speedster Game</div>
                  <div className="app-custom_button">Play</div>
                </div>

                <div className="app-game-card" onClick={() => setmovePages(3)}>
                  <div className="app-game-image">
                    <img src="/quick.png" alt="Quick Click Game" />
                  </div>
                  <div className="app-game-name">Quick Click Game</div>
                  <div className="app-custom_button">Play</div>
                </div>


                <div className="app-game-card" onClick={() => setmovePages(5)}>
                  <div className="app-game-image">
                    <img src="/balloon.png" alt="Balloon Game" />
                  </div>
                  <div className="app-game-name">Balloon Game</div>
                  <div className="app-custom_button">Play</div>
                </div>

                <div className="app-game-card" onClick={() => setmovePages(7)}>
                  <div className="app-game-image">
                    <img src="/missingv.jpg" alt="Missing Number Game" />
                  </div>
                  <div className="app-game-name">Missing Number Game</div>
                  <div className="app-custom_button">Play</div>
                </div>

                <div className="app-game-card" onClick={() => setmovePages(9)}>
                  <div className="app-game-image">
                    <img src="/arrowv.jpg" alt="Track of Thought Game" />
                  </div>
                  <div className="app-game-name">Arrow Game</div>
                  <div className="app-custom_button">Play</div>
                </div>

                <div className="app-game-card" onClick={() => setmovePages(12)}>
                  <div className="app-game-image">
                    <img src="/digitv.jpg" alt="Track of Thought Game" />
                  </div>
                  <div className="app-game-name">Star Search Game</div>
                  <div className="app-custom_button">Play</div>
                </div>

                <div className="app-game-card" onClick={openPinballApi}>
                  <div className="app-game-image">
                    <img src="/pinv.jpg" alt="Open Pinball Recall Game" />
                  </div>
                  <div className="app-game-name">Open Pinball Recall Game</div>
                  <NavLink className="app-custom_button" to="https://open-pinball-recall.vercel.app/">
                    Play
                  </NavLink>
                </div>

                <div className="app-game-card" onClick={() => setmovePages(8)}>
                  <div className="app-game-image">
                    <img src="/trackp.jpg" alt="Track of Thought Game" />
                  </div>
                  <div className="app-game-name">Track of Thought Game</div>
                  <div className="app-custom_button">Play</div>
                </div>


                <div className="app-game-card" onClick={() => setmovePages(10)}>
                  <div className="app-game-image">
                    <img src="/digitv.jpg" alt="Track of Thought Game" />
                  </div>
                  <div className="app-game-name">Digits Game</div>
                  <div className="app-custom_button">Play</div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {movePages === 2 && (
        <div className="app-game_platforms">
          <SymbolGame userName={localName} userEmail={localEmail} setmovePages={setmovePages} />
        </div>
      )}

      {movePages === 3 && (
        <div className="app-game_platforms">
          <QuickClickGame userName={localName} userEmail={localEmail} setmovePages={setmovePages} />
        </div>
      )}

      {movePages === 4 && (
        <div>
          <UserProfile localName={localName} localEmail={localEmail} setmovePages={setmovePages} />
        </div>
      )}

      {movePages === 5 && (
        <div className="app-game_platforms">
          <BalloonGame userName={localName} userEmail={localEmail} setmovePages={setmovePages} />
        </div>
      )}

      {movePages === 7 && (
        <div className="app-game_platforms">
          <MissingNumberGame userName={localName} userEmail={localEmail} setmovePages={setmovePages} />
        </div>
      )}

      {/* Inside your return function */}
      {movePages === 8 && (
        <div className="app-game_platforms">
          <TrackOfThoughtGame userName={localName} userEmail={localEmail} setmovePages={setmovePages} />
        </div>
      )}

      {/* Inside your return function */}
      {movePages === 9 && (
        <div className="app-game_platforms">
          <ArrowGame userName={localName} userEmail={localEmail} setmovePages={setmovePages} />
        </div>
      )}

      {/* Inside your return function */}
      {movePages === 10 && (
        <div className="app-game_platforms">
          <DigitsGame userName={localName} userEmail={localEmail} setmovePages={setmovePages} />
        </div>
      )}

      {/* Inside your return function */}
      {movePages === 11 && (
        <div className="app-game_platforms">
          <InstructionsPage userName={localName} userEmail={localEmail} setmovePages={setmovePages} />
        </div>
      )}

      {movePages === 12 && (
        <div className="app-game_platforms">
          <StarSearchGame userName={localName} userEmail={localEmail} setmovePages={setmovePages} />
        </div>
      )}

    </div>
  );
}

export default App;
