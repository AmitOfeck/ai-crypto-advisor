import { Router } from 'express';
import { signup, login } from '../controllers/authController';
import { validateSignup, validateLogin } from '../middleware/validation';

const router = Router();

// POST /auth/signup
router.post('/signup', validateSignup, signup);

// POST /auth/login
router.post('/login', validateLogin, login);

export default router;

