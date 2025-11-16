// backend/src/services/authService.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

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

export class AuthService {
  private jwtSecret: string;

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'your-secret-key-change-this';
  }

  // Sign up
  async signUp(data: SignUpData) {
    const { name, email, password } = data;

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword
      },
      select: {
        id: true,
        name: true,
        email: true,
        twoFactorEnabled: true,
        createdAt: true
      }
    });

    // Generate token
    const token = this.generateToken(user.id);

    return {
      user,
      token
    };
  }

  // Login - Updated for 2FA
  async login(data: LoginData) {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      throw new Error('Invalid credentials');
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Return flag indicating 2FA is required
      return {
        requiresTwoFactor: true,
        userId: user.id
      };
    }

    // Generate token (only if 2FA not enabled)
    const token = this.generateToken(user.id);

    const { password: _, twoFactorSecret: __, ...userWithoutSensitive } = user;

    return {
      user: userWithoutSensitive,
      token,
      requiresTwoFactor: false
    };
  }

  // Complete login after 2FA verification
  async completeTwoFactorLogin(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const token = this.generateToken(user.id);

    return {
      user,
      token
    };
  }

  // Get user by ID
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        twoFactorEnabled: true,
        createdAt: true,
        updatedAt: true
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  // Generate JWT token
  generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      this.jwtSecret,
      { expiresIn: '7d' }
    );
  }

  // Verify JWT token
  verifyToken(token: string): { userId: string } {
    try {
      const decoded = jwt.verify(token, this.jwtSecret) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

export const authService = new AuthService();