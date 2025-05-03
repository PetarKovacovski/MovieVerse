// tests/setup.js
import mongoose from 'mongoose';
import config from '../src/config/index.js';
import { connectDB } from '../src/config/connectDB.js';

beforeAll(async () => {
  await connectDB(config.dbUri);
});

afterAll(async () => {
  await mongoose.connection.close();
});
