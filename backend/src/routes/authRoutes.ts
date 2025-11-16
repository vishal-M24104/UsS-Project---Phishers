// backend/src/routes/authRoutes.ts - Updated with complete2FA route
import express, { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Public routes
router.post('/signup', authController.signUp.bind(authController));
router.post('/login', authController.login.bind(authController));
router.post('/complete-2fa', authController.complete2FA.bind(authController)); // NEW ROUTE

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile.bind(authController));
router.post('/logout', authMiddleware, authController.logout.bind(authController));

export default router;