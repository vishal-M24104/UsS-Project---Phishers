import { Request, Response } from 'express';
import { authService } from '../services/authService';
import { validateLogin, validateSignUp } from '../utils/validation';

export class AuthController {
  // Sign up
  async signUp(req: Request, res: Response): Promise<Response> {
    try {
      // Validate input
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

  // Login
  async login(req: Request, res: Response): Promise<Response> {
    try {
      // Validate input
      const { error, value } = validateLogin(req.body);
      if (error) {
        return res.status(400).json({
          success: false,
          message: error.details[0].message
        });
      }

      const result = await authService.login(value);

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

  // Get current user profile
  async getProfile(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).userId; // Added by auth middleware

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
}

export const authController = new AuthController();