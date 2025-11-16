import { Router } from 'express';
import { signup, login } from '../controllers/authController';

const router = Router();

// POST /auth/signup
router.post('/signup', signup);

// POST /auth/login
router.post('/login', login);

export default router;

