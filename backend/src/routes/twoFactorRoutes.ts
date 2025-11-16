// backend/src/routes/twoFactorRoutes.ts
import express, { Router } from 'express';
import { twoFactorController } from '../controllers/twoFactorController';
import { authMiddleware } from '../middleware/authMiddleware';

const router: Router = express.Router();

// All 2FA routes require authentication
router.post('/generate', authMiddleware, twoFactorController.generate.bind(twoFactorController));
router.post('/enable', authMiddleware, twoFactorController.enable.bind(twoFactorController));
router.post('/verify', twoFactorController.verify.bind(twoFactorController)); // No auth - used during login
router.post('/disable', authMiddleware, twoFactorController.disable.bind(twoFactorController));
router.get('/status', authMiddleware, twoFactorController.getStatus.bind(twoFactorController));

export default router;