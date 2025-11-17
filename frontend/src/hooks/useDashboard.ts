import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardAPI, onboardingAPI } from '../utils/apiService';

interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number | null | undefined;
  image: string;
}

interface NewsItem {
  id: string;
  title: string;
  url?: string;
  published_at: string;
  source: { title: string; region: string };
  currencies?: Array<{ code: string; title: string }>;
}

interface AIInsight {
  id: string;
  content: string;
  generatedAt: string;
  model?: string;
}

interface MemeItem {
  id: string;
  title: string;
  imageUrl: string;
  source: string;
  url?: string;
}

export interface DashboardData {
  coinPrices: CoinPrice[];
  marketNews: NewsItem[];
  aiInsight: AIInsight;
  meme: MemeItem;
  preferences?: {
    investorType: string;
    contentPreferences: string[];
  } | null;
}

export const useDashboard = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        // Check onboarding status
        const statusResponse = await onboardingAPI.getStatus();
        if (!statusResponse.completed) {
          navigate('/onboarding');
          return;
        }

        // Load dashboard data
        const response = await dashboardAPI.getDashboard();
        setDashboardData(response);
      } catch (err: any) {
        setError(err.response?.data?.error || 'Failed to load dashboard');
      } finally {
        setIsLoading(false);
      }
    };
    loadDashboard();
  }, [navigate]);

  return { dashboardData, isLoading, error };
};

