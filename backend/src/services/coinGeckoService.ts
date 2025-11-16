import axios from 'axios';

// CoinGecko API base URL (free tier, no API key required)
const COINGECKO_API_BASE = 'https://api.coingecko.com/api/v3';

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
    const response = await axios.get(`${COINGECKO_API_BASE}/coins/markets`, {
      params: {
        vs_currency: currency,
        order: 'market_cap_desc',
        per_page: limit,
        page: 1,
        sparkline: false,
      },
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
    // Return fallback data if API fails
    return getFallbackCoinPrices();
  }
};

/**
 * Get prices for specific coins by their IDs
 */
export const getSpecificCoinPrices = async (
  coinIds: string[],
  currency: string = 'usd'
): Promise<CoinPrice[]> => {
  try {
    const response = await axios.get(`${COINGECKO_API_BASE}/coins/markets`, {
      params: {
        vs_currency: currency,
        ids: coinIds.join(','),
        order: 'market_cap_desc',
        sparkline: false,
      },
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

