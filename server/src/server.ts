import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import apiRouter from './routes/index.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { SeedService } from './services/seedService.js';

const app = express();

// Security Headers with Helmet
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);

// CORS Configuration
const allowedOrigins = [
  config.CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:5174',
  'http://localhost:5175',
  'http://localhost:5176',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin) || config.NODE_ENV === 'development') {
        callback(null, true);
      } else {
        callback(new Error('Blocked by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting (100 requests per 15 minutes per IP for general APIs)
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});

app.use('/api', apiLimiter);

// Simple Request Logging
app.use((req, res, next) => {
  if (config.NODE_ENV === 'development') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`[${timestamp}] ${req.method} ${req.originalUrl}`);
  }
  next();
});

// API Routes
app.use('/api', apiRouter);

// 404 Handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `API endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Root welcome route
app.get('/', (req, res) => {
  res.json({
    app: 'Antiview — AI-Powered Technical Interview Platform',
    tagline: 'Your AI-powered technical interview simulator.',
    status: 'operational',
    docs: '/api/health',
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

// Bootstrap Server
const startServer = async () => {
  try {
    // 1. Initialize Database
    await connectDB();

    // 2. Automatically seed demo data if needed
    await SeedService.seedDemoData();

    // 3. Start Express HTTP Listener
    const server = app.listen(config.PORT, () => {
      console.log('====================================================');
      console.log(`🚀 Antiview Backend Server running in [${config.NODE_ENV}] mode`);
      console.log(`📡 URL: http://localhost:${config.PORT}`);
      console.log(`🔗 API Base: http://localhost:${config.PORT}/api`);
      console.log(`✨ Gemini AI: ${config.GEMINI_API_KEY ? 'Active (gemini-3.8-flash)' : 'Fallback Dynamic Engine (Ready)'}`);
      console.log('====================================================');
    });

    // Graceful Shutdown
    const handleShutdown = (signal: string) => {
      console.log(`\n🛑 Received ${signal}. Gracefully shutting down Antiview server...`);
      server.close(() => {
        console.log('🏁 HTTP server closed.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
