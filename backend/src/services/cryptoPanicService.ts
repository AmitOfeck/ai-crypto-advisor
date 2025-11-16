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
 * Map display names to CryptoPanic currency codes
 * Based on CryptoPanic API documentation
 */
const ASSET_TO_CURRENCY_CODE: Record<string, string> = {
  'Bitcoin': 'BTC',
  'Ethereum': 'ETH',
  'Binance Coin': 'BNB',
  'Cardano': 'ADA',
  'Solana': 'SOL',
  'Polkadot': 'DOT',
  'Dogecoin': 'DOGE',
  'Polygon': 'MATIC',
  'Avalanche': 'AVAX',
  'Chainlink': 'LINK',
};

/**
 * Convert user's interested assets to CryptoPanic currency codes
 */
const mapAssetsToCurrencyCodes = (assets: string[]): string => {
  if (!assets || assets.length === 0) {
    return 'BTC,ETH'; // Default to major coins
  }
  
  const codes = assets
    .map(asset => ASSET_TO_CURRENCY_CODE[asset])
    .filter(code => code !== undefined) // Remove unmapped assets
    .slice(0, 5); // CryptoPanic API limit: max 5 currencies
  
  return codes.length > 0 ? codes.join(',') : 'BTC,ETH';
};

/**
 * Extract source title from CryptoPanic API response
 */
const extractSourceTitle = (item: any): string => {
  // Extract source title from multiple possible formats
  let sourceTitle = 'Unknown';
  
  if (item.source) {
    if (typeof item.source === 'string') {
      sourceTitle = item.source;
    } else if (item.source.title) {
      sourceTitle = item.source.title;
    } else if (item.source.name) {
      sourceTitle = item.source.name;
    } else if (item.source.domain) {
      sourceTitle = item.source.domain;
    }
  } else if (item.domain) {
    sourceTitle = item.domain;
  }
  
  // Fallback: Extract domain from URL if source is still unknown
  if (sourceTitle === 'Unknown' && item.url) {
    try {
      const url = new URL(item.url);
      const hostname = url.hostname.replace(/^www\./, '');
      const domainParts = hostname.split('.');
      
      // If it's cryptopanic.com, use "CryptoPanic"
      if (hostname.includes('cryptopanic.com')) {
        sourceTitle = 'CryptoPanic';
      } else {
        // Extract main domain (e.g., "coindesk" from "coindesk.com")
        sourceTitle = domainParts[0];
        // Capitalize first letter
        sourceTitle = sourceTitle.charAt(0).toUpperCase() + sourceTitle.slice(1);
      }
    } catch (e) {
      // If URL parsing fails, keep as Unknown
    }
  }
  
  // If still unknown, default to CryptoPanic
  if (sourceTitle === 'Unknown') {
    sourceTitle = 'CryptoPanic';
  }
  
  return sourceTitle;
};

/**
 * Get latest crypto news from CryptoPanic
 * @param limit Number of news items to fetch (default: 10)
 * @param interestedAssets Optional array of user's interested crypto assets for personalization
 */
export const getMarketNews = async (
  limit: number = 10,
  interestedAssets?: string[]
): Promise<NewsItem[]> => {
  try {
    const apiKey = process.env.CRYPTOPANIC_API_KEY;
    
    // Use user's interested assets if provided, otherwise default to BTC,ETH
    const currencyCodes = mapAssetsToCurrencyCodes(interestedAssets || []);
    
    const params: any = {
      filter: 'hot', // hot, rising, or bullrun
      currencies: currencyCodes, // Personalized based on user preferences
    };

    // Add API key if configured (required for API access)
    if (apiKey && apiKey !== 'your-cryptopanic-api-key-here') {
      params.auth_token = apiKey;
    } else {
      // If no API key, use public endpoint
      params.public = true;
    }

    const response = await axios.get(`${CRYPTOPANIC_API_BASE}/posts/`, {
      params,
      headers: {
        'User-Agent': 'AI-Crypto-Advisor/1.0',
      },
      timeout: 10000, // 10 second timeout
    });

    const results = response.data.results || [];
    return results.slice(0, limit).map((item: any) => ({
      id: item.id.toString(),
      title: item.title,
      url: item.url,
      published_at: item.published_at,
      source: {
        title: extractSourceTitle(item),
        region: item.source?.region || item.region || 'global',
      },
      currencies: item.currencies?.map((curr: any) => ({
        code: curr.code,
        title: curr.title,
      })),
    }));
  } catch (error: any) {
    console.error('CryptoPanic API error:', error.message);
    if (error.response) {
      console.error('API response status:', error.response.status);
      console.error('API response data:', error.response.data);
    }
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

