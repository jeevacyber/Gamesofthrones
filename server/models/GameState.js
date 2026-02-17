
import mongoose from 'mongoose';

const gameStateSchema = new mongoose.Schema({
    round1Locked: { type: Boolean, default: true },
    round2Locked: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now }
});

const GameState = mongoose.model('GameState', gameStateSchema);
export default GameState;
