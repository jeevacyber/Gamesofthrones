
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const app = express();

// CORS Configuration
const allowedOrigins = [
    'http://localhost:8080',
    'http://localhost:5173',
    'http://localhost:3000',
    'https://gamesofthrones-ivto.vercel.app',
    process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc)
        if (!origin) return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(null, true); // Allow all origins in dev
    },
    credentials: true,
    optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
app.use(express.json());

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://admin:admin@cluster0.pj04tl3.mongodb.net/ctf-db?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB error:', err));


// Register
app.post('/api/register', async (req, res) => {
    const { teamName, email, password, teamMember1, teamMember2, teamMember3, collegeName } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            teamName,
            email,
            password: hashedPassword,
            teamMember1,
            teamMember2,
            teamMember3,
            collegeName
        });
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully', user: { id: newUser._id, email: newUser.email, role: 'participant', teamName: newUser.teamName } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Registration failed ' + error.message });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ error: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

        res.json({ user: { id: user._id, email: user.email, role: user.role, teamName: user.teamName } });
    } catch (error) {
        res.status(500).json({ error: 'Login failed' });
    }
});

// Submit Flag
app.post('/api/submit', async (req, res) => {
    const { userId, challengeId, flag, points } = req.body;
    try {
        // Handle mock admin user
        if (userId === 'admin-123') {
            console.log(`Admin user submitted flag for ${challengeId} (not saved to DB)`);
            return res.json({ message: 'Solve recorded (admin mock)', solves: [] });
        }

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Format timestamp as readable string
        const timestamp = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            hour12: true
        });

        // Add solve
        user.solves.push({ challengeId, flag, points, timestamp });
        await user.save();

        res.json({ message: 'Solve recorded', solves: user.solves });
    } catch (error) {
        console.error('Submit error:', error);
        res.status(500).json({ error: 'Submission failed' });
    }
});

// Get Teams (for leaderboard/admin)
app.get('/api/teams', async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: 'admin' } }, 'teamName email collegeName teamMember1 teamMember2 role solves round1Completed round2Completed');
        // Calculate score
        const teams = users.map(u => ({
            ...u.toObject(),
            score: u.solves.reduce((acc, curr) => acc + curr.points, 0),
            flagsSolved: u.solves.length,
            lastSolve: u.solves.length > 0 ? u.solves[u.solves.length - 1].timestamp : null
        }));
        res.json(teams);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch teams' });
    }
});

// Get User Data (for participant dashboard/rounds)
app.get('/api/user/:userId', async (req, res) => {
    try {
        // Basic validation for ObjectId format if needed, but for now just try-catch
        let user;
        try {
            user = await User.findById(req.params.userId, 'teamName email collegeName solves round1Completed round2Completed');
        } catch (e) {
            // If ID is invalid format (e.g. "admin-123"), treat as not found or handle mock admin
            if (req.params.userId === 'admin-123') {
                return res.json({
                    teamName: '',
                    email: 'admin@ctf.com',
                    collegeName: '',
                    solves: [],
                    score: 0,
                    flagsSolved: 0,
                    round1Completed: false,
                    round2Completed: false
                });
            }
            return res.status(404).json({ error: 'User not found (invalid ID)' });
        }

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Calculate scores
        const score = user.solves.reduce((acc, curr) => acc + curr.points, 0);
        res.json({
            teamName: user.teamName,
            email: user.email,
            collegeName: user.collegeName,
            solves: user.solves,
            score,
            flagsSolved: user.solves.length,
            round1Completed: user.round1Completed,
            round2Completed: user.round2Completed
        });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch user data' });
    }
});

// Complete Round
app.post('/api/complete-round', async (req, res) => {
    const { userId, round } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (round === 1) user.round1Completed = true;
        if (round === 2) user.round2Completed = true;

        await user.save();
        res.json({ message: `Round ${round} marked as completed` });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update round status' });
    }
});

// Reset Round for User (Admin)
app.post('/api/reset-round-user', async (req, res) => {
    const { userId, round } = req.body;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const r1Titles = [
            "The Dragon's Whisper", "Burning Pages", "Ember Trail", "Fire & Smoke", "Valyrian Script",
            "Dragon's Lair", "Flame Keeper", "Molten Core", "Ash & Bone", "Dragonfire"
        ];

        if (round === 1) {
            user.round1Completed = false;
            // Remove R1 solves
            user.solves = user.solves.filter(s => !r1Titles.includes(s.challengeId));
        }
        if (round === 2) {
            user.round2Completed = false;
            // Remove R2 solves (assumes everything else is R2)
            user.solves = user.solves.filter(s => r1Titles.includes(s.challengeId));
        }

        await user.save();
        res.json({ message: `Round ${round} reset (cleared solves) for user ${user.teamName}` });
    } catch (error) {
        console.error("Reset error:", error);
        res.status(500).json({ error: 'Failed to reset round status' });
    }
});

import GameState from './models/GameState.js';

// ... (existing code)

// Get Global Game State
app.get('/api/game-state', async (req, res) => {
    try {
        let state = await GameState.findOne();
        if (!state) {
            state = new GameState();
            await state.save();
        }
        res.json(state);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch game state' });
    }
});

// Update Global Game State
app.post('/api/game-state', async (req, res) => {
    const { round1Locked, round2Locked } = req.body;
    try {
        let state = await GameState.findOne();
        if (!state) {
            state = new GameState();
        }
        if (typeof round1Locked !== 'undefined') state.round1Locked = round1Locked;
        if (typeof round2Locked !== 'undefined') state.round2Locked = round2Locked;
        state.updatedAt = Date.now();
        await state.save();
        res.json(state);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update game state' });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
