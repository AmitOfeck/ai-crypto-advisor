import axios from 'axios';

// CoinGecko API base URL (free tier, no API key required)
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

/**
 * Map display names to CoinGecko API IDs
 * Based on CoinGecko API documentation: https://www.coingecko.com/en/api/documentation
 */
const COIN_NAME_TO_ID_MAP: Record<string, string> = {
  'Bitcoin': 'bitcoin',
  'Ethereum': 'ethereum',
  'Binance Coin': 'binancecoin',
  'Cardano': 'cardano',
  'Solana': 'solana',
  'Polkadot': 'polkadot',
  'Dogecoin': 'dogecoin',
  'Polygon': 'matic-network',
  'Avalanche': 'avalanche-2',
  'Chainlink': 'chainlink',
};

/**
 * Convert display names to CoinGecko API IDs
 * Falls back to lowercase version if not in map
 */
const mapDisplayNameToCoinId = (displayName: string): string => {
  // Check if we have a direct mapping
  if (COIN_NAME_TO_ID_MAP[displayName]) {
    return COIN_NAME_TO_ID_MAP[displayName];
  }
  
  // Fallback: convert to lowercase and replace spaces with hyphens
  // This handles most common cases for custom assets
  return displayName.toLowerCase().replace(/\s+/g, '-');
};

export interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

/**
 * Get top cryptocurrency prices
 * @param limit Number of coins to fetch (default: 10)
 * @param currency Target currency (default: 'usd')
 */
export const getCoinPrices = async (
  limit: number = 10,
  currency: string = 'usd'
): Promise<CoinPrice[]> => {
  try {
    const apiKey = process.env.COINGECKO_API_KEY;
    const headers: any = {};
    
    // Add API key header if available
    if (apiKey && apiKey !== 'your-coingecko-api-key-here') {
      headers['x-cg-demo-api-key'] = apiKey;
    }
    
    const response = await axios.get(`${COINGECKO_API_BASE}/coins/markets`, {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
      },
      headers,
    });

    return response.data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h || 0,
      market_cap: coin.market_cap,
      image: coin.image,
    }));
  } catch (error: any) {
    console.error('CoinGecko API error:', error.message);
    if (error.response) {
      console.error('API response status:', error.response.status);
      console.error('API response data:', error.response.data);
    }
    // Return fallback data if API fails
    return getFallbackCoinPrices();
  }
};

/**
 * Get prices for specific coins by their display names or IDs
 * Automatically converts display names to CoinGecko API IDs
 */
export const getSpecificCoinPrices = async (
  coinNamesOrIds: string[],
  currency: string = 'usd'
): Promise<CoinPrice[]> => {
  try {
    // Convert display names to CoinGecko IDs
    const coinIds = coinNamesOrIds.map(mapDisplayNameToCoinId);
    
    const apiKey = process.env.COINGECKO_API_KEY;
    const headers: any = {};
    
    // Add API key header if available
    if (apiKey && apiKey !== 'your-coingecko-api-key-here') {
      headers['x-cg-demo-api-key'] = apiKey;
    }
    
    console.log('[CoinGecko] Requesting prices for:', coinNamesOrIds);
    console.log('[CoinGecko] Mapped IDs:', coinIds);
    console.log('[CoinGecko] Using API key:', apiKey ? 'Yes' : 'No');
    
    const response = await axios.get(`${COINGECKO_API_BASE}/coins/markets`, {
      params: {
        vs_currency: currency,
        ids: coinIds.join(','),
        order: 'market_cap_desc',
        sparkline: false,
      },
      headers,
      timeout: 15000, // 15 second timeout
    });

    // Handle empty response - CoinGecko returns [] if no coins match
    if (!response.data || response.data.length === 0) {
      console.warn('[CoinGecko] Empty response for IDs:', coinIds);
      console.warn('[CoinGecko] Falling back to top coins');
      // Fallback to top coins instead of static data
      return getCoinPrices(coinNamesOrIds.length || 10);
    }

    const prices = response.data.map((coin: any) => ({
      id: coin.id,
      symbol: coin.symbol.toUpperCase(),
      name: coin.name,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h || 0,
      market_cap: coin.market_cap,
      image: coin.image,
    }));
    
    console.log(`[CoinGecko] Successfully fetched ${prices.length} coins`);
    return prices;
  } catch (error: any) {
    console.error('[CoinGecko] API error:', error.message);
    console.error('[CoinGecko] Requested coins:', coinNamesOrIds);
    if (error.response) {
      console.error('[CoinGecko] Status:', error.response.status);
      console.error('[CoinGecko] Response:', error.response.data);
    }
    
    // If rate limited (429), try fallback to top coins
    if (error.response?.status === 429) {
      console.warn('[CoinGecko] Rate limited, falling back to top coins');
      return getCoinPrices(coinNamesOrIds.length || 10);
    }
    
    // For other errors, return fallback
    return getFallbackCoinPrices();
  }
};

/**
 * Fallback coin prices if API fails
 */
const getFallbackCoinPrices = (): CoinPrice[] => {
  return [
    {
      id: 'bitcoin',
      symbol: 'BTC',
      name: 'Bitcoin',
      current_price: 45000,
      price_change_percentage_24h: 2.5,
      market_cap: 850000000000,
      image: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png',
    },
    {
      id: 'ethereum',
      symbol: 'ETH',
      name: 'Ethereum',
      current_price: 2800,
      price_change_percentage_24h: -1.2,
      market_cap: 340000000000,
      image: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png',
    },
  ];
};

