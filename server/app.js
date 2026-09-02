import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import path from 'path';
import mongoose from 'mongoose';

import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.routes.js';
import chaptersRoutes from './routes/chapters.routes.js';
import memoriesRoutes from './routes/memories.routes.js';
import friendsRoutes from './routes/friends.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import settingsRoutes from './routes/settings.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Security Headers with relaxed CSP for cross-origin assets (Unsplash, Cloudinary, etc.)
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

// CORS configuration supporting localhost, Vercel preview domains, and production frontend
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://memories-ochre-ten.vercel.app',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (curl, mobile apps, server-to-server)
      if (!origin) return callback(null, true);

      // Allow if explicitly listed or if it's any .vercel.app domain
      const isVercelDomain = origin.endsWith('.vercel.app');
      const isAllowed = allowedOrigins.includes(origin) || isVercelDomain || process.env.NODE_ENV === 'development';

      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error(`CORS policy blocked access from origin: ${origin}`), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 1000,
  message: { success: false, message: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Serverless DB connection middleware (ensures DB is connected on Vercel)
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error('Serverless DB connection error:', err.message);
    }
  }
  next();
});

// Favicon Handlers (prevents 404 error logs on browser/crawler hits)
app.get(['/favicon.ico', '/favicon.png'], (req, res) => res.status(204).end());

// Root Route (Welcome & API Overview)
app.get('/', (req, res) => {
  res.json({
    status: 'ok',
    app: 'College Memories / AlumniScraps Backend API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      chapters: '/api/chapters',
      memories: '/api/memories',
      friends: '/api/friends',
      messages: '/api/messages',
      settings: '/api/settings',
    },
  });
});

// Static uploads folder for fallback local uploads
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    app: 'College Memories / AlumniScraps Backend API',
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/chapters', chaptersRoutes);
app.use('/api/memories', memoriesRoutes);
app.use('/api/friends', friendsRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/settings', settingsRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

export default app;
