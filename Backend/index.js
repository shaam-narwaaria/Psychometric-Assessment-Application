// server/index.js
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/games", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define Score Schema and Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
});
const Users = mongoose.model("Users", userSchema);

const scoreSchema = new mongoose.Schema({
    gameName: String,
    name: String,
    email: String,
    score: Number,
    responseSymbolTime: Number,
    correctSymbolCount: Boolean,
    createdAt: { type: Date, default: Date.now },
});

const Score = mongoose.model("Score", scoreSchema);

// Register a new user
app.post("/api/register", async (req, res) => {
    const { name, email } = req.body;

    const prevalue = await Users.findOne({ email });
    console.log("prevalue=", prevalue);
    if (prevalue) {
        res.json({
            message: "Already a user",
        });
    } else {
        const newUser = new Users({ name, email });
        await newUser.save();
        res.json(newUser);
    }
});

// Endpoint to save score
app.post("/api/scores", async (req, res) => {
    const { gameName, name, email, score, responseSymbolTime, correctSymbolCount } = req.body;
    const newScore = new Score({ gameName, name, email, score, responseSymbolTime, correctSymbolCount });
    await newScore.save();
    res.json(newScore);
});

// Endpoint to retrieve scores by email (updated)
app.get("/api/getscores", async (req, res) => {
    const { email } = req.query; // Get the email from query parameters
    if (!email) {
        return res.status(400).json({ message: "Email is required" });
    }

    try {
        const scores = await Score.find({ email }).sort({ score: -1 }); // Filter scores by email
        if (scores.length === 0) {
            return res.status(404).json({ message: "No scores found for this user" });
        }
        res.json(scores);
    } catch (error) {
        console.error("Error fetching scores:", error);
        res.status(500).json({ message: "Server error" });
    }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
