import { useState, useEffect } from 'react';
import { feedbackAPI } from '../utils/apiService';

export const useFeedback = (
  feedbackType: 'market_news' | 'coin_prices' | 'ai_insight' | 'meme',
  itemId: string
) => {
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

  return { userVote, isLoading, handleVote };
};

