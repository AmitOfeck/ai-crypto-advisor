import { Router } from 'express';
import { submitFeedback, getUserFeedback } from '../controllers/feedbackController';
import { authenticate } from '../middleware/auth';

const router = Router();

// All feedback routes require authentication
router.use(authenticate);

// POST /feedback - Submit feedback (vote)
router.post('/', submitFeedback);

// GET /feedback/:feedbackType/:itemId - Get user's feedback for specific item
router.get('/:feedbackType/:itemId', getUserFeedback);

export default router;

