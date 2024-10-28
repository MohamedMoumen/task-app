import mongoose from 'mongoose';

let isConnected = false; // Track connection status

const dbConnect = async () => {
    if (isConnected) {
        console.log('Using existing database connection');
        return;
    }

    try {
        // Establish a new connection
        console.log(process.env.MONGODB_URI);
        await mongoose.connect(process.env.MONGODB_URI || '', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        isConnected = true;
        console.log('New database connection established');
    } catch (error) {
        console.error('Failed to connect to database', error);
        throw new Error('Failed to connect to database');
    }
};

export default dbConnect;
