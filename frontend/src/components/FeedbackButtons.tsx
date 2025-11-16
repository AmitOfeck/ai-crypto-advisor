import React, { useState, useEffect } from 'react';
import { feedbackAPI } from '../utils/apiService';

interface FeedbackButtonsProps {
  feedbackType: 'market_news' | 'coin_prices' | 'ai_insight' | 'meme';
  itemId: string;
}

const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  feedbackType,
  itemId,
}) => {
  const [userVote, setUserVote] = useState<'thumbs_up' | 'thumbs_down' | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load user's existing vote
    const loadFeedback = async () => {
      try {
        const response = await feedbackAPI.getFeedback(feedbackType, itemId);
        if (response.feedback) {
          setUserVote(response.feedback.vote);
        }
      } catch (error) {
        // No feedback yet
      }
    };
    loadFeedback();
  }, [feedbackType, itemId]);

  const handleVote = async (vote: 'thumbs_up' | 'thumbs_down') => {
    setIsLoading(true);
    try {
      await feedbackAPI.submitFeedback({ feedbackType, itemId, vote });
      setUserVote(vote);
    } catch (error) {
      console.error('Failed to submit feedback:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => handleVote('thumbs_up')}
        disabled={isLoading}
        className={`
          p-2 rounded-lg transition-all duration-200
          ${userVote === 'thumbs_up'
            ? 'bg-green-500/20 text-green-400 border border-green-500/50'
            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-green-400 border border-slate-600'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title="Thumbs up"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
          />
        </svg>
      </button>
      <button
        onClick={() => handleVote('thumbs_down')}
        disabled={isLoading}
        className={`
          p-2 rounded-lg transition-all duration-200
          ${userVote === 'thumbs_down'
            ? 'bg-red-500/20 text-red-400 border border-red-500/50'
            : 'bg-slate-700/50 text-slate-400 hover:bg-slate-700 hover:text-red-400 border border-slate-600'
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
        title="Thumbs down"
      >
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5"
          />
        </svg>
      </button>
    </div>
  );
};

export default FeedbackButtons;

