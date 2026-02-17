
import mongoose from 'mongoose';

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
        timestamp: String
    }],
    round1Completed: { type: Boolean, default: false },
    round2Completed: { type: Boolean, default: false }
});

const User = mongoose.model('User', userSchema);
export default User;
