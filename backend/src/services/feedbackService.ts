import { Feedback as FeedbackModel, IFeedback } from '../models/Feedback';
import { Feedback, CreateFeedbackData } from '../models/FeedbackTypes';
import mongoose from 'mongoose';

// Helper function to convert MongoDB document to Feedback type
const toFeedback = (doc: IFeedback): Feedback => ({
  id: (doc as any)._id.toString(),
  userId: doc.userId.toString(),
  feedbackType: doc.feedbackType,
  itemId: doc.itemId,
  vote: doc.vote,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

/**
 * Save or update user feedback (vote)
 */
export const saveFeedback = async (
  userId: string,
  feedbackData: CreateFeedbackData
): Promise<Feedback> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  // Use upsert to create or update feedback (user can change their vote)
  const feedback = await FeedbackModel.findOneAndUpdate(
    {
      userId: userObjectId,
      feedbackType: feedbackData.feedbackType,
      itemId: feedbackData.itemId,
    },
    {
      userId: userObjectId,
      feedbackType: feedbackData.feedbackType,
      itemId: feedbackData.itemId,
      vote: feedbackData.vote,
    },
    {
      new: true,
      upsert: true,
      runValidators: true,
    }
  );

  return toFeedback(feedback);
};

/**
 * Get feedback for a specific item
 */
export const getFeedback = async (
  userId: string,
  feedbackType: string,
  itemId: string
): Promise<Feedback | null> => {
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const feedback = await FeedbackModel.findOne({
    userId: userObjectId,
    feedbackType,
    itemId,
  });

  if (!feedback) {
    return null;
  }

  return toFeedback(feedback);
};

