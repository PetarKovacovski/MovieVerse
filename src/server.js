import app from './app.js';
import config from './config/index.js';
import { connectDB } from './config/connectDB.js';
import mongoose from 'mongoose';

await connectDB(config.dbUri);

const server = app.listen(config.port, () => {
    console.log(`✅ Server running on port ${config.port}`);
});

process.on('SIGINT', async () => {
    console.log('\n\nShutting down process...');
    await mongoose.connection.close();
    console.log('MongoDB disconnected');
    server.close(() => {
        console.log('***Server closed***');
        process.exit(0);
    });
});