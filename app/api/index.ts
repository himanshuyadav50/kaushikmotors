import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import mongoose from 'mongoose';
import { connectDB } from './config/database.js';
import vehicleRoutes from './routes/vehicles.js';
import enquiryRoutes from './routes/enquiries.js';
import testimonialRoutes from './routes/testimonials.js';
import settingsRoutes from './routes/settings.js';
import adminRoutes from './routes/admin.js';
import { errorHandler } from './middleware/errorHandler.js';

// Load environment variables FIRST - specify path explicitly
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env from project root (go up from app/api/ to root)
const envPath = resolve(__dirname, '..', '..', '.env');
dotenv.config({ path: envPath });
console.log(`📄 Loading .env from: ${envPath}`);

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    message: 'Car Dealership API',
    version: '1.0.0',
    endpoints: {
      vehicles: '/api/vehicles',
      enquiries: '/api/enquiries',
      testimonials: '/api/testimonials',
      settings: '/api/settings',
      admin: '/api/admin',
      health: '/health'
    },
    documentation: 'See README.md for API documentation'
  });
});

// API routes
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/admin', adminRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server (even if MongoDB connection fails in development)
const startServer = async () => {
  // Try to connect to database, but don't exit if it fails in development
  try {
    await connectDB();
  } catch (error) {
    console.error('⚠️  Database connection failed, but server will start anyway');
    console.error('⚠️  API endpoints will not work until MongoDB is connected');
    if (process.env.NODE_ENV === 'production') {
      console.error('❌ Exiting in production mode due to database connection failure');
      process.exit(1);
    }
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 API available at http://localhost:${PORT}/api`);
    if (!mongoose.connection.readyState) {
      console.log('⚠️  MongoDB not connected - some features may not work');
    }
  });
};

// Start server only if not running on Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
  startServer();
}

// For Vercel serverless deployment, wrap the app to ensure DB connection
const handler = async (req: any, res: any) => {
  // Ensure database is connected (mongoose will reuse existing connection)
  if (mongoose.connection.readyState === 0) {
    try {
      await connectDB();
    } catch (error) {
      console.error('Database connection failed:', error);
      return res.status(500).json({ error: 'Database connection failed' });
    }
  }

  return app(req, res);
};

export default handler;

