import { Router, Response } from 'express';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

// GET /user/me - Get current user info (protected route)
router.get('/me', authenticate, (req: AuthRequest, res: Response): void => {
  // User info is available in req.user after authentication middleware
  res.status(200).json({
    message: 'User authenticated',
    user: req.user,
  });
});

export default router;

