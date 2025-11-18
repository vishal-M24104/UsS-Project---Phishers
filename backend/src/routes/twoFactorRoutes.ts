// backend/src/routes/twoFactorRoutes.ts
import express, { Router } from 'express';
import { twoFactorController } from '../controllers/twoFactorController';
import { authMiddleware } from '../middleware/authMiddleware';
import { twoFactorLimiter } from '../middleware/rateLimiter';

const router: Router = express.Router();

/**
 * Protected 2FA management routes
 * User must already be authenticated
 */
router.post(
  '/generate',
  authMiddleware,
  twoFactorController.generate.bind(twoFactorController)
);

router.post(
  '/enable',
  authMiddleware,
  twoFactorController.enable.bind(twoFactorController)
);

router.post(
  '/disable',
  authMiddleware,
  twoFactorController.disable.bind(twoFactorController)
);

router.get(
  '/status',
  authMiddleware,
  twoFactorController.getStatus.bind(twoFactorController)
);

/**
 * Public route for verifying 2FA code during login
 * Protected with strict rate limiting to prevent brute-force
 */
router.post(
  '/verify',
  twoFactorLimiter,
  twoFactorController.verify.bind(twoFactorController)
);

export default router;
