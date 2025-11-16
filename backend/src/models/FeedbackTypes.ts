// TypeScript interfaces for Feedback operations

import { FeedbackType, VoteType } from './Feedback';

export interface Feedback {
  id: string;
  userId: string;
  feedbackType: FeedbackType;
  itemId: string;
  vote: VoteType;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateFeedbackData {
  feedbackType: FeedbackType;
  itemId: string;
  vote: VoteType;
}

// Re-export enums for convenience
export { FeedbackType, VoteType };

