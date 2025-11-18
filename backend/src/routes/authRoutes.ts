// backend/src/routes/authRoutes.ts
import express from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';
import { authLimiter, signupLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Public routes with rate limiting
router.post('/signup', signupLimiter, authController.signUp.bind(authController));
router.post('/login', authLimiter, authController.login.bind(authController));
router.post('/refresh-token', authController.refreshToken.bind(authController));
router.post('/complete-2fa', authController.complete2FA.bind(authController));

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile.bind(authController));
router.post('/logout', authMiddleware, authController.logout.bind(authController));

export default router;