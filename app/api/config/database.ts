import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// Load env vars to ensure they're available
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const envPath = resolve(__dirname, '..', '..', '..', '.env');
dotenv.config({ path: envPath });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/car-dealership';

export const connectDB = async (): Promise<void> => {
  try {
    // Log which URI is being used (hide password)
    const uriToLog = MONGODB_URI.includes('@')
      ? MONGODB_URI.replace(/:[^:@]+@/, ':****@')
      : MONGODB_URI;
    console.log(`🔌 Attempting to connect to MongoDB: ${uriToLog}`);

    if (!process.env.MONGODB_URI) {
      console.warn('⚠️  MONGODB_URI not found in environment variables, using default localhost');
    }

    const conn = await mongoose.connect(MONGODB_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.error('💡 Make sure your MONGODB_URI in .env is correct');
    console.error(`💡 Current MONGODB_URI: ${MONGODB_URI.includes('@') ? MONGODB_URI.replace(/:[^:@]+@/, ':****@') : MONGODB_URI}`);
    throw error;
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err);
});

