// backend/src/controllers/authController.ts - Updated with complete2FA
import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { validateLogin, validateSignUp } from '../utils/validation';

export class AuthController {
  // Sign up
  async signUp(req: Request, res: Response): Promise<Response> {
    try {
      const { error, value } = validateSignUp(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const result = await authService.signUp(value);

      return res.status(201).json({
        success: true,
        message: 'User created successfully',
        data: result
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to create user'
      });
    }
  }

  // Login - Updated to handle 2FA
  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { error, value } = validateLogin(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const result = await authService.login(value);

      // Check if 2FA is required
      if (result.requiresTwoFactor) {
        return res.status(200).json({
          success: true,
          requiresTwoFactor: true,
          tempUserId: result.userId,
          message: '2FA verification required'
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message || 'Login failed'
      });
    }
  }

  // Complete 2FA login - NEW ENDPOINT
  async complete2FA(req: Request, res: Response): Promise<Response> {
    try {
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({
          success: false,
          message: 'User ID is required'
        });
      }

      const result = await authService.completeTwoFactorLogin(userId);

      return res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || 'Failed to complete login'
      });
    }
  }

  // Get current user profile
  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).userId;

      const user = await authService.getUserById(userId);

      return res.status(200).json({
        success: true,
        data: user
      });
    } catch (error: any) {
      return res.status(404).json({
        success: false,
        message: error.message || 'User not found'
      });
    }
  }

  // Logout
  async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      if (!token) {
        res.status(400).json({
          success: false,
          message: 'No token provided'
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error: any) {
      console.error('Logout error:', error);
      res.status(500).json({
        success: false,
        message: 'Logout failed',
        error: error.message
      });
    }
  }
}

export const authController = new AuthController();