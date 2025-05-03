import app from './app.js';
import config from './config/index.js';
import { connectDB } from './config/connectDB.js';
import mongoose from 'mongoose';
import logger from './shared/utils/logger.js';

await connectDB(config.dbUri);


const server = app.listen(config.port, () => {
    logger.info(`✅ Server running on port ${config.port}`);
});

process.on('SIGINT', async () => {
    logger.info('Shutting down process...');
    await mongoose.connection.close();
    logger.info('MongoDB disconnected');
    server.close(() => {
        logger.info('***Server closed***');
        process.exit(0);
    });
});