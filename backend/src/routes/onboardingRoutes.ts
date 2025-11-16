import { Router } from 'express';
import { saveOnboarding, getOnboarding, getOnboardingStatus } from '../controllers/onboardingController';
import { authenticate } from '../middleware/auth';
import { validateOnboarding } from '../middleware/onboardingValidation';

const router = Router();

// All onboarding routes require authentication
router.use(authenticate);

// POST /onboarding - Save user preferences
router.post('/', validateOnboarding, saveOnboarding);

// GET /onboarding - Get user preferences
router.get('/', getOnboarding);

// GET /onboarding/status - Check if onboarding is completed
router.get('/status', getOnboardingStatus);

export default router;

