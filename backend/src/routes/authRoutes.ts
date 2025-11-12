import express, { Router } from 'express';
import { authController } from '../controllers/authController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = express.Router();

// Public routes
router.post('/signup', authController.signUp.bind(authController));
router.post('/login', authController.login.bind(authController));

// Protected routes
router.get('/profile', authMiddleware, authController.getProfile.bind(authController));

export default router;