import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { CreateFeedbackData, FeedbackType, VoteType } from '../models/FeedbackTypes';
import { saveFeedback, getFeedback } from '../services/feedbackService';

/**
 * Submit feedback (vote) for a dashboard item
 * POST /feedback
 */
export const submitFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const feedbackData: CreateFeedbackData = {
      feedbackType: req.body.feedbackType as FeedbackType,
      itemId: req.body.itemId,
      vote: req.body.vote as VoteType,
    };

    // Validate feedback type and vote type
    if (!Object.values(FeedbackType).includes(feedbackData.feedbackType)) {
      res.status(400).json({ error: 'Invalid feedback type' });
      return;
    }

    if (!Object.values(VoteType).includes(feedbackData.vote)) {
      res.status(400).json({ error: 'Invalid vote type' });
      return;
    }

    if (!feedbackData.itemId) {
      res.status(400).json({ error: 'Item ID is required' });
      return;
    }

    const feedback = await saveFeedback(req.user.userId, feedbackData);

    res.status(200).json({
      message: 'Feedback submitted successfully',
      feedback,
    });
  } catch (error: any) {
    console.error('Submit feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get user's feedback for a specific item
 * GET /feedback/:feedbackType/:itemId
 */
export const getUserFeedback = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const feedbackType = req.params.feedbackType as FeedbackType;
    const itemId = req.params.itemId;

    if (!Object.values(FeedbackType).includes(feedbackType)) {
      res.status(400).json({ error: 'Invalid feedback type' });
      return;
    }

    const feedback = await getFeedback(req.user.userId, feedbackType, itemId);

    if (!feedback) {
      res.status(404).json({ error: 'Feedback not found' });
      return;
    }

    res.status(200).json({
      feedback,
    });
  } catch (error: any) {
    console.error('Get feedback error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

