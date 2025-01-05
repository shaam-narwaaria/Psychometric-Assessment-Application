import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './UserProfile.css';

const UserProfile = (props) => {
    const { localName, localEmail, setmovePages } = props;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        try {
            // Send email as a query parameter to fetch scores for the specific user
            const result = await axios.get(`http://localhost:5000/api/getscores?email=${localEmail}`);
            setData(result?.data || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [localEmail]);  // Fetch data when the localEmail changes

    // Filter selected user data based on the email
    const selectedUser = data.filter((item) => item.email === localEmail);

    // Game statistics calculation function
    const gameStats = (gameName, minWinScore = 5) => {
        const totalGames = selectedUser.filter((item) => item.gameName === gameName);
        const gamesWon = totalGames.filter((item) => item.score >= minWinScore);

        const avgScore = totalGames.length
            ? totalGames.reduce((acc, item) => acc + item.score, 0) / totalGames.length
            : 0;

        const avgResponseTime = totalGames.length
            ? totalGames.reduce((acc, item) => acc + (item.responseSymbolTime || 0), 0) / totalGames.length
            : 0;

        return { totalGames, gamesWon, avgScore, avgResponseTime };
    };

    // Psychometric trait thresholds for each game
    const gameTraitThresholds = {
        attention: { minResponseTime: 200, maxResponseTime: 300 },
        focus: { minScore: 50, maxScore: 70 },
        verbalReasoning: { minScore: 30, maxScore: 50 },
        numericalReasoning: { minScore: 40, maxScore: 60 },
        abstractReasoning: { minResponseTime: 200, maxResponseTime: 300 },
        situationalJudgment: { minScore: 50 },
    };

    // Calculate psychometric traits based on game stats
    const getPsychometricTraits = (gameStats) => {
        let traits = {
            attentionScore: 40,
            focusScore: 30,
            verbalReasoningScore: 40,
            numericalReasoningScore: 60,
            abstractReasoningScore: 10,
            situationalJudgmentScore: 60,
        };

        Object.keys(gameStats).forEach((game) => {
            const stats = gameStats[game];
            const thresholds = gameTraitThresholds[game];

            // Check if thresholds exist for the game
            if (thresholds) {
                if (stats.avgResponseTime) {
                    if (stats.avgResponseTime < thresholds.minResponseTime) traits.attentionScore += 15;
                    else if (stats.avgResponseTime < thresholds.maxResponseTime) traits.attentionScore += 10;
                }

                if (stats.avgScore) {
                    if (stats.avgScore > thresholds.minScore) traits.focusScore += 10;
                    if (stats.avgScore > thresholds.maxScore) traits.focusScore += 15;
                }
            }
        });

        return {
            attentionScore: Math.min(traits.attentionScore, 100),
            focusScore: Math.min(traits.focusScore, 100),
            verbalReasoningScore: Math.min(traits.verbalReasoningScore, 100),
            numericalReasoningScore: Math.min(traits.numericalReasoningScore, 100),
            abstractReasoningScore: Math.min(traits.abstractReasoningScore, 100),
            situationalJudgmentScore: Math.min(traits.situationalJudgmentScore, 100),
        };
    };

    // Collecting stats for different games
    const gameStatsData = {
        pinballcounter: gameStats("pinballcounter"),
        symbolcounter: gameStats("symbolcounter"),
        quickClick: gameStats("QuickClick"),
        balloonGame: gameStats("BalloonGame"),
        missingNumberGame: gameStats("MissingNumber"),
    };

    const {
        attentionScore,
        focusScore,
        verbalReasoningScore,
        numericalReasoningScore,
        abstractReasoningScore,
        situationalJudgmentScore,
    } = getPsychometricTraits(gameStatsData);

    // Helper function to determine the level of performance
    const getLevel = (score) => {
        if (score >= 80) return { level: 'High', color: 'green' };
        else if (score >= 50) return { level: 'Moderate', color: 'orange' };
        return { level: 'Low', color: 'red' };
    };

    // Function to render a game section
    const renderGameSection = (gameName, displayName, imageSrc, minWinScore = 20) => {
        const { totalGames, gamesWon, avgScore, avgResponseTime } = gameStats(gameName, minWinScore);

        return (
            <div className="col-md-4" key={gameName}>
                <div className="game_card">
                    <img className="game_img" src={imageSrc} alt={displayName} />
                    <div className="game_details">
                        <h4>{displayName}</h4>
                        <p>Games Won: {gamesWon.length} / {totalGames.length || 0}</p>
                        <p>Average Score: {avgScore.toFixed(2)}</p>
                        {avgResponseTime > 0 && <p>Avg. Response Time: {avgResponseTime.toFixed(2)} ms</p>}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="user_profile">
            <div className="container">
                {loading ? (
                    <div className="loading_spinner">Loading...</div>
                ) : (
                    <>
                        {data.length === 0 ? (
                            <div className="error_message">No data available</div>
                        ) : (
                            <>
                                <div className="profile_section">
                                    <div className="profile_info">
                                        <div className="profile_pic">
                                            <img src="/man.png" alt="Profile" />
                                        </div>
                                        <h4>Name: <span>{localName}</span></h4>
                                        <h4>Email: <span>{localEmail}</span></h4>
                                    </div>

                                    <button className="btn_play_more" onClick={() => setmovePages(1)}>Play More Games</button>

                                    <h2 className="game_scores_header">Your Game Scores</h2>

                                    <h3>Psychometric Predictions</h3>
                                    <div className="psychometric_predictions">
                                        {['Attention', 'Focus', 'Verbal Reasoning', 'Numerical Reasoning', 'Abstract Reasoning', 'Situational Judgment'].map((trait, idx) => {
                                            const score = [attentionScore, focusScore, verbalReasoningScore, numericalReasoningScore, abstractReasoningScore, situationalJudgmentScore][idx];
                                            const { level, color } = getLevel(score);
                                            return (
                                                <div className="score_card" key={trait}>
                                                    <h4>{trait} Score</h4>
                                                    <div className="score_bar">
                                                        <div className="score_indicator" style={{ width: `${score}%`, backgroundColor: color }}></div>
                                                    </div>
                                                    <p>{level}</p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className="row">
                                    {renderGameSection("SymbolCounter", "Symbol Speedster Game", "/symbol.jpg")}
                                    {renderGameSection("QuickClick", "Quick Click Game", "/clickp.jpg")}
                                    {renderGameSection("BalloonGame", "Balloon Game", "/balloonp.jpg")}
                                    {renderGameSection("MissingNumber", "Missing Number Game", "/missingp.jpg")}
                                    {renderGameSection("ArrowGame", "Arrow Game", "/arrowp.jpg")}
                                    {renderGameSection("SearchStar", "Star Search Game", "/digitp.jpg")}
                                    {renderGameSection("pinballcounter", "Open Pinball Recall Game", "/pinp.jpg")}
                                    {renderGameSection("thoughtgame", "Track of Thought Game", "/trackp.jpg")}
                                    {renderGameSection("DigitGame", "Digit Game", "/digitp.jpg")}
                                </div>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
