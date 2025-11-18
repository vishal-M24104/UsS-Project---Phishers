// backend/src/services/authService.ts - Fixed version
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { decrypt, encrypt, encryptDeterministic } from '../utils/encryption';

const prisma = new PrismaClient();

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

interface TokenPayload {
  userId: string;
  type: 'access' | 'refresh';
}

export class AuthService {
  private jwtSecret: string;
  private jwtRefreshSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-this';
    this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || this.jwtSecret + '-refresh';
  }

  async signUp(data: SignUpData) {
    try {
      const { name, email, password } = data;
      
      console.log('📝 SignUp attempt for:', email);

      // FIXED: Use deterministic encryption for email (searchable)
      const normalizedEmail = email.toLowerCase().trim();
      const encryptedEmail = encryptDeterministic(normalizedEmail);
      console.log('🔐 Email encrypted (deterministic)');

      // Check if user exists
      const existingUser = await prisma.user.findUnique({
        where: { email: encryptedEmail }
      });

      if (existingUser) {
        console.log('❌ User already exists');
        throw new Error('User already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('🔒 Password hashed');

      // Use random encryption for name (not searchable, more secure)
      const encryptedName = encrypt(name);
      console.log('🔐 Name encrypted');

      // Create user
      const user = await prisma.user.create({
        data: {
          name: encryptedName,
          email: encryptedEmail,
          password: hashedPassword
        }
      });

      console.log('✅ User created successfully:', user.id);

      return {
        user: {
          id: user.id,
          name: decrypt(user.name),
          email: decrypt(user.email),
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt
        }
      };
    } catch (error: any) {
      console.error('❌ SignUp error:', error.message);
      throw error;
    }
  }

  async login(data: LoginData) {
    try {
      const { email, password } = data;
      
      console.log('🔐 Login attempt for:', email);

      // FIXED: Use deterministic encryption for email lookup (must match signup)
      const normalizedEmail = email.toLowerCase().trim();
      const encryptedEmail = encryptDeterministic(normalizedEmail);
      console.log('🔐 Email encrypted for lookup (deterministic)');

      // Find user
      const user = await prisma.user.findUnique({
        where: { email: encryptedEmail }
      });

      if (!user) {
        console.log('❌ User not found');
        throw new Error('Invalid credentials');
      }

      console.log('✅ User found:', user.id);

      // Verify password
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        console.log('❌ Invalid password');
        throw new Error('Invalid credentials');
      }

      console.log('✅ Password verified');

      // Check if 2FA is enabled
      if (user.twoFactorEnabled) {
        console.log('🔒 2FA enabled, returning temp userId');
        return {
          requiresTwoFactor: true,
          userId: user.id
        };
      }

      console.log('🔑 Generating tokens...');

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokenPair(user.id);

      console.log('✅ Tokens generated successfully');

      // Decrypt user data
      const decryptedUser = {
        id: user.id,
        name: decrypt(user.name),
        email: decrypt(user.email),
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };

      console.log('✅ User data decrypted');

      return {
        user: decryptedUser,
        accessToken,
        refreshToken,
        requiresTwoFactor: false
      };
    } catch (error: any) {
      console.error('❌ Login error:', error.message);
      throw error;
    }
  }

  async completeTwoFactorLogin(userId: string) {
    try {
      console.log('🔐 Completing 2FA login for:', userId);

      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        console.log('❌ User not found');
        throw new Error('User not found');
      }

      console.log('✅ User found, generating tokens...');

      // Generate tokens
      const { accessToken, refreshToken } = await this.generateTokenPair(user.id);

      console.log('✅ Tokens generated');

      return {
        user: {
          id: user.id,
          name: decrypt(user.name),
          email: decrypt(user.email),
          twoFactorEnabled: user.twoFactorEnabled,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        },
        accessToken,
        refreshToken
      };
    } catch (error: any) {
      console.error('❌ Complete 2FA error:', error.message);
      throw error;
    }
  }

  async getUserById(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return {
        id: user.id,
        name: decrypt(user.name),
        email: decrypt(user.email),
        twoFactorEnabled: user.twoFactorEnabled,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      };
    } catch (error: any) {
      console.error('❌ Get user error:', error.message);
      throw error;
    }
  }

  private async generateTokenPair(userId: string) {
    try {
      console.log('🔑 Generating access token...');
      
      // Generate access token (15 minutes)
      const accessToken = jwt.sign(
        { userId, type: 'access' } as TokenPayload,
        this.jwtSecret,
        { expiresIn: '15m' }
      );

      console.log('🔑 Generating refresh token...');

      // Generate refresh token value
      const refreshTokenValue = crypto.randomBytes(64).toString('hex');
      
      // Sign refresh token
      const refreshToken = jwt.sign(
        { userId, type: 'refresh', token: refreshTokenValue } as TokenPayload & { token: string },
        this.jwtRefreshSecret,
        { expiresIn: '7d' }
      );

      console.log('🔑 Hashing refresh token...');

      // Hash refresh token for storage
      const hashedRefreshToken = crypto
        .createHash('sha256')
        .update(refreshTokenValue)
        .digest('hex');

      console.log('💾 Storing refresh token in database...');

      // Store refresh token
      await prisma.refreshToken.create({
        data: {
          userId,
          token: hashedRefreshToken,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        }
      });

      console.log('✅ Tokens generated and stored successfully');

      return { accessToken, refreshToken };
    } catch (error: any) {
      console.error('❌ Generate token pair error:', error.message);
      throw error;
    }
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      console.log('🔄 Refreshing access token...');

      // Verify refresh token
      const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as TokenPayload & { token: string };

      if (decoded.type !== 'refresh') {
        throw new Error('Invalid token type');
      }

      // Hash token for database lookup
      const hashedToken = crypto
        .createHash('sha256')
        .update(decoded.token)
        .digest('hex');

      // Find refresh token
      const storedToken = await prisma.refreshToken.findUnique({
        where: { token: hashedToken }
      });

      if (!storedToken || storedToken.userId !== decoded.userId) {
        throw new Error('Invalid refresh token');
      }

      // Check expiration
      if (storedToken.expiresAt < new Date()) {
        await prisma.refreshToken.delete({ where: { id: storedToken.id } });
        throw new Error('Refresh token expired');
      }

      console.log('✅ Refresh token valid, deleting old token...');

      // Delete old token (rotation)
      await prisma.refreshToken.delete({ where: { id: storedToken.id } });

      console.log('🔑 Generating new token pair...');

      // Generate new tokens
      const tokens = await this.generateTokenPair(decoded.userId);

      console.log('✅ Token refresh successful');

      return tokens;
    } catch (error: any) {
      console.error('❌ Refresh token error:', error.message);
      throw new Error('Invalid or expired refresh token');
    }
  }

  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as TokenPayload;
      
      if (decoded.type !== 'access') {
        throw new Error('Invalid token type');
      }

      return { userId: decoded.userId };
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    try {
      if (refreshToken) {
        const decoded = jwt.verify(refreshToken, this.jwtRefreshSecret) as TokenPayload & { token: string };
        const hashedToken = crypto
          .createHash('sha256')
          .update(decoded.token)
          .digest('hex');

        await prisma.refreshToken.deleteMany({
          where: {
            userId,
            token: hashedToken
          }
        });
      }
      
      console.log('✅ Logout successful');
    } catch (error: any) {
      console.error('❌ Logout error:', error.message);
    }
  }

  async cleanupExpiredTokens() {
    await prisma.refreshToken.deleteMany({
      where: {
        expiresAt: {
          lt: new Date()
        }
      }
    });
  }
}

export const authService = new AuthService();