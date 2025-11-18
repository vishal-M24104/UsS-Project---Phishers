// backend/src/index.ts
import cors from 'cors';
import dotenv from 'dotenv';
import express, { Application, Request, Response } from 'express';
import helmet from 'helmet';
import { apiSpeedLimiter, generalLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/authRoutes';
import twoFactorRoutes from './routes/twoFactorRoutes';

// Load environment variables
dotenv.config();

// Validate critical environment variables
if (!process.env.JWT_SECRET) {
  console.error('❌ FATAL: JWT_SECRET is not set in environment variables');
  process.exit(1);
}

if (!process.env.ENCRYPTION_KEY) {
  console.warn('⚠️  WARNING: ENCRYPTION_KEY not set. Using default (insecure for production)');
}

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Security Middleware
app.use(helmet({
  contentSecurityPolicy: false, // Adjust based on your needs
  crossOriginEmbedderPolicy: false
}));

// CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Apply general rate limiting to all routes
app.use(generalLimiter);
app.use(apiSpeedLimiter);

// Health check route
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Phishing Game API is running',
    version: '1.0.0',
    security: {
      rateLimit: 'enabled',
      encryption: 'AES-256-CBC',
      tokenType: 'JWT with refresh rotation'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/2fa', twoFactorRoutes);

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  console.error('Error:', err.stack);
  
  // Don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;
  
  res.status(500).json({
    success: false,
    message
  });
});

// Start server
app.listen(3000, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔒 Security features enabled:`);
  console.log(`   ✓ Rate limiting (in-memory)`);
  console.log(`   ✓ Data encryption (AES-256-CBC)`);
  console.log(`   ✓ Refresh token rotation`);
  console.log(`   ✓ Helmet security headers`);
  console.log(`📍 Health check: http://localhost:${PORT}`);
  console.log(`🔐 Auth API: http://localhost:${PORT}/api/auth`);
});