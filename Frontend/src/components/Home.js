import React from "react";
import './Home.css';

function Home({ setmovePages }) {
    return (
        <div className="home-page-container">
            {/* Top Navigation */}
            <header className="home-page-top-nav">
                <div className="home-page-container-inner">
                    <h1>Welcome to PsyGauge</h1>
                    <p className="home-page-intro-text">PsyGauge is a gamified psychometric assessment tool designed to revolutionize candidate evaluation through interactive and insightful gameplay.</p>
                    <p className="home-page-intro-text">Assess critical skills like multitasking, problem-solving, reaction time, and strategic planning through nine targeted games. Get data-driven insights into your abilities and unlock your potential.</p>
                </div>
            </header>

            {/* Games Section */}
            <section className="home-page-games-section">
                <h2 className="home-page-section-title">Explore Our Games</h2>
                <div className="home-page-games-grid">
                    <div className="home-page-game-card">
                        <img src="/trackp.jpg" alt="Multitasking Game" />
                        <h3>Multitasking Challenge</h3>
                        <p>Test your ability to manage multiple tasks effectively.</p>
                    </div>
                    <div className="home-page-game-card">
                        <img src="/missingp.jpg" alt="Problem-Solving Game" />
                        <h3>Problem Solver</h3>
                        <p>Sharpen your analytical and problem-solving skills.</p>
                    </div>
                    <div className="home-page-game-card">
                        <img src="/clickp.jpg" alt="Reaction Time Game" />
                        <h3>Reaction Timer</h3>
                        <p>Gauge your speed and accuracy under pressure.</p>
                    </div>
                    <div className="home-page-game-card">
                        <img src="/starp.jpg" alt="Strategic Planning Game" />
                        <h3>Recall Power</h3>
                        <p>Plan ahead and execute strategies efficiently.</p>
                    </div>
                    <div className="home-page-game-card">
                        <img src="/starp.jpg" alt="Decision Making Game" />
                        <h3>Decision Maker</h3>
                        <p>Improve your decision-making skills in real time.</p>
                    </div>
                </div>
            </section>

            {/* Get Started Button */}
            <div className="home-page-get-started">
                <button
                    onClick={() => setmovePages(1)}
                    className="home-page-custom-button"
                    aria-label="Start the assessment">
                    Get Started
                </button>
            </div>

            {/* FAQ Section */}
            <section className="home-page-faq">
                <div className="home-page-container-inner">
                    <h2>Frequently Asked Questions</h2>
                    <div className="home-page-faq-items">
                        <div className="home-page-faq-item">
                            <h3>What is PsyGauge?</h3>
                            <p>PsyGauge is an interactive platform using games to assess key psychometric attributes, helping employers match candidates to job roles.</p>
                        </div>
                        <div className="home-page-faq-item">
                            <h3>How does it work?</h3>
                            <p>Each game is designed to measure specific cognitive and decision-making skills. By analyzing gameplay data, PsyGauge provides insights into your abilities.</p>
                        </div>
                        <div className="home-page-faq-item">
                            <h3>Who can use PsyGauge?</h3>
                            <p>It’s ideal for employers in recruitment, candidates seeking self-assessment, and anyone looking to gain insights into their cognitive strengths.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Bottom Bar with Social Links */}
            <footer className="home-page-bottom-bar">
                <div className="home-page-container-inner">
                    <p>&copy; {new Date().getFullYear()} PsyGauge. All rights reserved.</p>
                    <div className="home-page-social-links">
                        <a href="https://twitter.com/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Follow us on Twitter">Twitter</a>
                        <a href="https://linkedin.com/in/yourprofile" target="_blank" rel="noopener noreferrer" aria-label="Connect with us on LinkedIn">LinkedIn</a>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default Home;
