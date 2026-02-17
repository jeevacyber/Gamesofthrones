
import mongoose from 'mongoose';
import User from './models/User.js';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = 'mongodb+srv://admin:admin@cluster0.pj04tl3.mongodb.net/ctf-db?retryWrites=true&w=majority&appName=Cluster0';

// Mock schema if User.js is not imported correctly
const userSchema = new mongoose.Schema({
    teamName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    teamMember1: { type: String, required: true },
    teamMember2: { type: String, required: true },
    teamMember3: { type: String, required: true },
    collegeName: { type: String, required: true },
    role: { type: String, default: 'participant' },
    createdAt: { type: Date, default: Date.now },
    solves: [{
        challengeId: String,
        flag: String,
        points: Number,
        timestamp: { type: Date, default: Date.now }
    }],
    round1Completed: { type: Boolean, default: false },
    round2Completed: { type: Boolean, default: false }
});
// Avoid redefining model
const UserModel = mongoose.models.User || mongoose.model('User', userSchema);

async function testReset() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected');

        // 1. Create dummy user with mixed solves
        const seed = Date.now();
        const testTeam = "ResetTest_" + seed;
        const user = new UserModel({
            teamName: testTeam,
            email: testTeam + "@test.com",
            password: "p",
            teamMember1: "a",
            teamMember2: "b",
            teamMember3: "c",
            collegeName: "d",
            solves: [
                { challengeId: "The Dragon's Whisper", points: 100 }, // R1
                { challengeId: "Iron Throne", points: 350 }, // R2
                { challengeId: "Burning Pages", points: 150 } // R1
            ]
        });
        await user.save();
        console.log("Created user " + testTeam + " with 3 solves (2 R1, 1 R2)");

        // 2. Mock R1 Titles
        const r1Titles = ["The Dragon's Whisper", "Burning Pages"];

        // 3. Reset R1
        user.solves = user.solves.filter(s => !r1Titles.includes(s.challengeId));
        await user.save();

        // 4. Reload and check
        const updatedUser = await UserModel.findById(user._id);
        console.log("After R1 Reset, solves count:", updatedUser.solves.length);
        console.log("Remaining Solves Titles:", updatedUser.solves.map(s => s.challengeId));

        if (updatedUser.solves.length === 1 && updatedUser.solves[0].challengeId === "Iron Throne") {
            console.log("SUCCESS: Only R2 solve remains.");
        } else {
            console.log("FAILURE: Solves mismatch.");
        }

        // Cleanup
        await UserModel.deleteOne({ _id: user._id });
        console.log("Cleanup done.");
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

testReset();
