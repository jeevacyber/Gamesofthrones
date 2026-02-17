
import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:admin@cluster0.pj04tl3.mongodb.net/ctf-db?retryWrites=true&w=majority&appName=Cluster0');
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;
