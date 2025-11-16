import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CreateUserPreferencesData } from '../models/UserPreferencesTypes';
import { savePreferences, getPreferences, hasCompletedOnboarding } from '../services/onboardingService';

/**
 * Save user onboarding preferences
 * POST /onboarding
 */
export const saveOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const preferencesData: CreateUserPreferencesData = {
      interestedAssets: req.body.interestedAssets || [],
      investorType: req.body.investorType,
      contentPreferences: req.body.contentPreferences || [],
    };

    const preferences = await savePreferences(req.user.userId, preferencesData);

    res.status(200).json({
      message: 'Preferences saved successfully',
      preferences,
    });
  } catch (error: any) {
    console.error('Save onboarding error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get user onboarding preferences
 * GET /onboarding
 */
export const getOnboarding = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const preferences = await getPreferences(req.user.userId);

    if (!preferences) {
      res.status(404).json({ error: 'Preferences not found' });
      return;
    }

    res.status(200).json({
      preferences,
    });
  } catch (error: any) {
    console.error('Get onboarding error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Check if user has completed onboarding
 * GET /onboarding/status
 */
export const getOnboardingStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const completed = await hasCompletedOnboarding(req.user.userId);

    res.status(200).json({
      completed,
    });
  } catch (error: any) {
    console.error('Get onboarding status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

