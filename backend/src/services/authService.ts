import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'], // Enable Prisma logging
});

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
  // Generate JWT token
  private generateToken(userId: string): string {
    return jwt.sign(
      { userId },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );
  }

  // Sign up new user
  async signUp(data: SignUpData) {
    const { name, email, password } = data;

    console.log('🔍 SignUp attempt for:', email);

    try {
      // Check if user already exists
      console.log('📝 Checking if user exists...');
      const existingUser = await prisma.user.findUnique({
        where: { email }
      });

      if (existingUser) {
        console.log('❌ User already exists:', email);
        throw new Error('User with this email already exists');
      }

      console.log('✅ User does not exist, proceeding with creation...');

      // Hash password
      console.log('🔐 Hashing password...');
      const hashedPassword = await bcrypt.hash(password, 10);
      console.log('✅ Password hashed successfully');

      // Create user
      console.log('💾 Creating user in database...');
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword
        }
      });

      console.log('✅ User created successfully!');
      console.log('==========================================');
      console.log('📋 USER DETAILS:');
      console.log('  ID:', user.id);
      console.log('  Name:', user.name);
      console.log('  Email:', user.email);
      console.log('  Created At:', user.createdAt);
      console.log('  Two Factor Enabled:', user.twoFactorEnabled);
      console.log('==========================================');

      // Generate token
      const token = this.generateToken(user.id);
      console.log('🎫 Token generated');

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        token
      };
    } catch (error: any) {
      console.error('❌ SignUp error:', error);
      
      // Log more details for Prisma errors
      if (error.code) {
        console.error('Prisma error code:', error.code);
        console.error('Prisma error meta:', error.meta);
      }
      
      throw error;
    }
  }

  // Login user
  async login(data: LoginData) {
    const { email, password } = data;

    console.log('🔍 Login attempt for:', email);

    try {
      // Find user
      const user = await prisma.user.findUnique({
        where: { email }
      });

      if (!user) {
        console.log('❌ User not found:', email);
        throw new Error('Invalid email or password');
      }

      console.log('✅ User found');

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        console.log('❌ Invalid password');
        throw new Error('Invalid email or password');
      }

      console.log('✅ Password valid');

      // Generate token
      const token = this.generateToken(user.id);

      return {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          twoFactorEnabled: user.twoFactorEnabled
        },
        token
      };
    } catch (error: any) {
      console.error('❌ Login error:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId: string) {
    try {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          id: true,
          name: true,
          email: true,
          twoFactorEnabled: true,
          createdAt: true
        }
      });

      if (!user) {
        throw new Error('User not found');
      }

      return user;
    } catch (error: any) {
      console.error('❌ GetUserById error:', error);
      throw error;
    }
  }

  // Verify token
  verifyToken(token: string) {
    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key'
      ) as { userId: string };
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }
}

export const authService = new AuthService();