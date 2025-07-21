import { Request, Response, NextFunction } from "express";
import { authService } from "../auth";
import { storage } from "../storage";
import type { User } from "@shared/schema";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export async function authenticateToken(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ message: "Access token required" });
    }

    const payload = authService.verifyToken(token);
    if (!payload) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }

    // Get fresh user data
    const user = await storage.getUser(payload.userId);
    if (!user) {
      return res.status(403).json({ message: "User not found" });
    }

    req.user = {
      id: user.id,
      email: user.email!,
      role: user.role!,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(403).json({ message: "Invalid token" });
  }
}

export function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  if (!req.user) {
    return res.status(401).json({ message: "Authentication required" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin access required" });
  }

  next();
}

export function optionalAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return next(); // Continue without user
  }

  try {
    const payload = authService.verifyToken(token);
    if (payload) {
      storage
        .getUser(payload.userId)
        .then((user: User | undefined) => {
          if (user) {
            req.user = {
              id: user.id,
              email: user.email!,
              role: user.role!,
            };
          }
          next();
        })
        .catch(() => next());
    } else {
      next();
    }
  } catch (error) {
    next(); // Continue without user if token is invalid
  }
}
