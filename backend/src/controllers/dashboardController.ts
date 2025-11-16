import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { getCoinPrices, getSpecificCoinPrices } from '../services/coinGeckoService';
import { getMarketNews } from '../services/cryptoPanicService';
import { getAIInsight } from '../services/aiService';
import { getRandomMeme } from '../services/memeService';
import { getPreferences } from '../services/onboardingService';

/**
 * Get personalized dashboard data
 * GET /dashboard
 */
export const getDashboard = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    // Get user preferences to personalize content
    const preferences = await getPreferences(req.user.userId);

    // Fetch all dashboard sections in parallel
    const [coinPrices, marketNews, aiInsight, meme] = await Promise.all([
      // Get coin prices - use user's interested assets if available
      preferences?.interestedAssets && preferences.interestedAssets.length > 0
        ? getSpecificCoinPrices(preferences.interestedAssets.slice(0, 10))
        : getCoinPrices(10),
      // Get market news
      getMarketNews(10),
      // Get AI insight with user preferences
      getAIInsight({
        interestedAssets: preferences?.interestedAssets,
        investorType: preferences?.investorType,
      }),
      // Get random meme
      getRandomMeme(),
    ]);

    res.status(200).json({
      coinPrices,
      marketNews,
      aiInsight,
      meme,
      preferences: preferences
        ? {
            investorType: preferences.investorType,
            contentPreferences: preferences.contentPreferences,
          }
        : null,
    });
  } catch (error: any) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
};

