import mongoose, { Schema, Document } from 'mongoose';

// Feedback types enum
export enum FeedbackType {
  MARKET_NEWS = 'market_news',
  COIN_PRICES = 'coin_prices',
  AI_INSIGHT = 'ai_insight',
  MEME = 'meme',
}

// Vote types enum
export enum VoteType {
  THUMBS_UP = 'thumbs_up',
  THUMBS_DOWN = 'thumbs_down',
}

// MongoDB Feedback Document interface
export interface IFeedback extends Document {
  userId: mongoose.Types.ObjectId;
  feedbackType: FeedbackType;
  itemId: string; // ID of the specific item (news article ID, coin symbol, etc.)
  vote: VoteType;
  createdAt: Date;
  updatedAt: Date;
}

// Feedback Schema
const FeedbackSchema = new Schema<IFeedback>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    feedbackType: {
      type: String,
      enum: Object.values(FeedbackType),
      required: true,
    },
    itemId: {
      type: String,
      required: true,
    },
    vote: {
      type: String,
      enum: Object.values(VoteType),
      required: true,
    },
  },
  {
    timestamps: true,
    // Compound index to prevent duplicate votes on same item
    // User can only vote once per item, but can update their vote
  }
);

// Compound index: one vote per user per item
FeedbackSchema.index({ userId: 1, feedbackType: 1, itemId: 1 }, { unique: true });

// Export Feedback model
export const Feedback = mongoose.model<IFeedback>('Feedback', FeedbackSchema);

