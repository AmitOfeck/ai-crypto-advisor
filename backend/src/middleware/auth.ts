import { Request, Response, NextFunction } from 'express';
import { verifyToken, JWTPayload } from '../services/jwtService';

// Extend Express Request to include user info
export interface AuthRequest extends Request {
  user?: JWTPayload;
}

/**
 * Authentication middleware to verify JWT token
 */
export const authenticate = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'No token provided' });
      return;
    }

    // Extract token from "Bearer <token>"
    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);

    // Attach user info to request
    req.user = decoded;

    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message || 'Invalid or expired token' });
  }
};

