import axios from 'axios';

// CryptoPanic API base URL (free tier, public API)
const CRYPTOPANIC_API_BASE = 'https://cryptopanic.com/api/v1';

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  published_at: string;
  source: {
    title: string;
    region: string;
  };
  currencies?: Array<{
    code: string;
    title: string;
  }>;
}

/**
 * Get latest crypto news from CryptoPanic
 * @param limit Number of news items to fetch (default: 10)
 */
export const getMarketNews = async (limit: number = 10): Promise<NewsItem[]> => {
  try {
    // CryptoPanic free API - public endpoint (no auth required for basic usage)
    // Note: For production, you may want to use their paid API with auth
    const response = await axios.get(`${CRYPTOPANIC_API_BASE}/posts/`, {
      params: {
        public: true,
        filter: 'hot', // hot, rising, or bullrun
        currencies: 'BTC,ETH', // Filter by major coins
      },
      headers: {
        // Some free APIs require a user-agent
        'User-Agent': 'AI-Crypto-Advisor/1.0',
      },
    });

    const results = response.data.results || [];
    return results.slice(0, limit).map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      url: item.url,
      published_at: item.published_at,
      source: {
        title: item.source?.title || 'Unknown',
        region: item.source?.region || 'global',
      },
      currencies: item.currencies?.map((curr: any) => ({
        code: curr.code,
        title: curr.title,
      })),
    }));
  } catch (error: any) {
    console.error('CryptoPanic API error:', error.message);
    // Return fallback news if API fails
    return getFallbackNews();
  }
};

/**
 * Fallback news if API fails
 */
const getFallbackNews = (): NewsItem[] => {
  return [
    {
      id: '1',
      title: 'Bitcoin Reaches New All-Time High',
      url: 'https://example.com/news/1',
      published_at: new Date().toISOString(),
      source: {
        title: 'Crypto News',
        region: 'global',
      },
      currencies: [
        { code: 'BTC', title: 'Bitcoin' },
      ],
    },
    {
      id: '2',
      title: 'Ethereum 2.0 Staking Reaches Milestone',
      url: 'https://example.com/news/2',
      published_at: new Date().toISOString(),
      source: {
        title: 'Crypto News',
        region: 'global',
      },
      currencies: [
        { code: 'ETH', title: 'Ethereum' },
      ],
    },
  ];
};

