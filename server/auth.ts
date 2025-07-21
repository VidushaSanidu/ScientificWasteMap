import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import type { User } from "@shared/schema";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export class AuthService {
  private jwtSecret: string;
  private jwtExpiresIn: string;

  constructor() {
    this.jwtSecret =
      process.env.JWT_SECRET || "fallback-secret-change-in-production";
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || "7d";
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  generateToken(payload: JWTPayload): string {
    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  verifyToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, this.jwtSecret) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  async register(data: RegisterData): Promise<{ user: User; token: string }> {
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(data.email);
    if (existingUser) {
      throw new Error("User already exists with this email");
    }

    // Hash password
    const hashedPassword = await this.hashPassword(data.password);

    // Create user
    const userId = `user_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;
    const userData = {
      id: userId,
      email: data.email,
      password: hashedPassword,
      firstName: data.firstName || null,
      lastName: data.lastName || null,
      role: "user" as const,
      isEmailVerified: false,
    };

    const user = await storage.upsertUser(userData);

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email!,
      role: user.role!,
    });

    return { user, token };
  }

  async login(
    credentials: LoginCredentials
  ): Promise<{ user: User; token: string }> {
    // Find user by email
    const user = await storage.getUserByEmail(credentials.email);
    if (!user || !user.password) {
      throw new Error("Invalid email or password");
    }

    // Check password
    const isValidPassword = await this.comparePassword(
      credentials.password,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Invalid email or password");
    }

    // Generate token
    const token = this.generateToken({
      userId: user.id,
      email: user.email!,
      role: user.role!,
    });

    return { user, token };
  }

  async createAdminUser(): Promise<User> {
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      throw new Error(
        "ADMIN_EMAIL and ADMIN_PASSWORD must be set in environment variables"
      );
    }

    // Check if admin already exists
    const existingAdmin = await storage.getUserByEmail(adminEmail);
    if (existingAdmin) {
      console.log("Admin user already exists");
      return existingAdmin;
    }

    // Create admin user
    const hashedPassword = await this.hashPassword(adminPassword);
    const adminId = `admin_${Date.now()}`;

    const adminData = {
      id: adminId,
      email: adminEmail,
      password: hashedPassword,
      firstName: "Admin",
      lastName: "User",
      role: "admin" as const,
      isEmailVerified: true,
    };

    const admin = await storage.upsertUser(adminData);
    console.log(`Admin user created: ${adminEmail}`);
    return admin;
  }
}

export const authService = new AuthService();
