// backend/src/controllers/twoFactorController.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import QRCode from 'qrcode';
import speakeasy from 'speakeasy';

const prisma = new PrismaClient();

export class TwoFactorController {
  // Generate 2FA secret and QR code
  async generate(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).userId;

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Check if 2FA is already enabled
      if (user.twoFactorEnabled) {
        return res.status(400).json({
          success: false,
          message: '2FA is already enabled'
        });
      }

      // Generate secret
      const secret = speakeasy.generateSecret({
        name: `QuizApp (${user.email})`,
        issuer: 'QuizApp'
      });

      // Generate QR code
      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

      // Store secret (temporarily - not enabled yet)
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorSecret: secret.base32 }
      });

      return res.status(200).json({
        success: true,
        data: {
          secret: secret.base32,
          qrCode: qrCodeUrl
        }
      });
    } catch (error: any) {
      console.error('Generate 2FA error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate 2FA secret'
      });
    }
  }

  // Verify and enable 2FA
  async enable(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).userId;
      const { token } = req.body;

      if (!token) {
        return res.status(400).json({
          success: false,
          message: 'Verification token is required'
        });
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user || !user.twoFactorSecret) {
        return res.status(400).json({
          success: false,
          message: 'No 2FA setup found. Please generate a secret first.'
        });
      }

      // Verify token
      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token,
        window: 2 // Allow 2 time steps before/after
      });

      if (!verified) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
      }

      // Generate backup codes
      const backupCodes: string[] = [];
      const hashedBackupCodes = [];

      for (let i = 0; i < 10; i++) {
        const code = this.generateBackupCode();
        backupCodes.push(code);
        const hashedCode = await bcrypt.hash(code, 10);
        hashedBackupCodes.push(hashedCode);
      }

      // Enable 2FA and save backup codes
      await prisma.user.update({
        where: { id: userId },
        data: { twoFactorEnabled: true }
      });

      // Delete old backup codes if any
      await prisma.backupCode.deleteMany({
        where: { userId }
      });

      // Create new backup codes
      await prisma.backupCode.createMany({
        data: hashedBackupCodes.map(code => ({
          userId,
          code
        }))
      });

      return res.status(200).json({
        success: true,
        message: '2FA enabled successfully',
        data: {
          backupCodes // Return plain backup codes only once
        }
      });
    } catch (error: any) {
      console.error('Enable 2FA error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to enable 2FA'
      });
    }
  }

  // Verify 2FA token during login
  async verify(req: Request, res: Response): Promise<Response> {
    try {
      const { userId, token, isBackupCode } = req.body;

      if (!userId || !token) {
        return res.status(400).json({
          success: false,
          message: 'User ID and token are required'
        });
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: { backupCodes: true }
      });

      if (!user || !user.twoFactorEnabled || !user.twoFactorSecret) {
        return res.status(400).json({
          success: false,
          message: '2FA not enabled for this user'
        });
      }

      let verified = false;

      if (isBackupCode) {
        // Verify backup code
        for (const backupCode of user.backupCodes) {
          if (!backupCode.used) {
            const match = await bcrypt.compare(token, backupCode.code);
            if (match) {
              // Mark backup code as used
              await prisma.backupCode.update({
                where: { id: backupCode.id },
                data: { used: true, usedAt: new Date() }
              });
              verified = true;
              break;
            }
          }
        }
      } else {
        // Verify TOTP token
        verified = speakeasy.totp.verify({
          secret: user.twoFactorSecret,
          encoding: 'base32',
          token: token,
          window: 2
        });
      }

      if (!verified) {
        return res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
      }

      return res.status(200).json({
        success: true,
        message: '2FA verification successful'
      });
    } catch (error: any) {
      console.error('Verify 2FA error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify 2FA token'
      });
    }
  }

  // Disable 2FA
  async disable(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).userId;
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({
          success: false,
          message: 'Password is required to disable 2FA'
        });
      }

      // Get user
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.status(401).json({
          success: false,
          message: 'Invalid password'
        });
      }

      // Disable 2FA and clear secret
      await prisma.user.update({
        where: { id: userId },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null
        }
      });

      // Delete backup codes
      await prisma.backupCode.deleteMany({
        where: { userId }
      });

      return res.status(200).json({
        success: true,
        message: '2FA disabled successfully'
      });
    } catch (error: any) {
      console.error('Disable 2FA error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to disable 2FA'
      });
    }
  }

  // Get 2FA status
  async getStatus(req: Request, res: Response): Promise<Response> {
    try {
      const userId = (req as any).userId;

      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          twoFactorEnabled: true,
          backupCodes: {
            where: { used: false },
            select: { id: true }
          }
        }
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      return res.status(200).json({
        success: true,
        data: {
          enabled: user.twoFactorEnabled,
          backupCodesRemaining: user.backupCodes.length
        }
      });
    } catch (error: any) {
      console.error('Get 2FA status error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to get 2FA status'
      });
    }
  }

  // Helper: Generate backup code
  private generateBackupCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 8; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  }
}

export const twoFactorController = new TwoFactorController();