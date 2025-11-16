import { body } from 'express-validator';
import { handleValidationErrors } from './validation';
import { InvestorType, ContentPreference } from '../models/UserPreferences';

// Onboarding validation rules
export const validateOnboarding = [
  body('interestedAssets')
    .isArray()
    .withMessage('interestedAssets must be an array')
    .notEmpty()
    .withMessage('At least one crypto asset must be selected'),
  body('interestedAssets.*')
    .isString()
    .trim()
    .notEmpty()
    .withMessage('Each asset must be a non-empty string'),
  body('investorType')
    .notEmpty()
    .withMessage('Investor type is required')
    .isIn(Object.values(InvestorType))
    .withMessage(`Investor type must be one of: ${Object.values(InvestorType).join(', ')}`),
  body('contentPreferences')
    .isArray()
    .withMessage('contentPreferences must be an array')
    .notEmpty()
    .withMessage('At least one content preference must be selected'),
  body('contentPreferences.*')
    .isIn(Object.values(ContentPreference))
    .withMessage(`Each content preference must be one of: ${Object.values(ContentPreference).join(', ')}`),
  handleValidationErrors,
];

