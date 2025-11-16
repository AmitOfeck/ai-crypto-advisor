import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dashboardAPI, onboardingAPI } from '../utils/apiService';
import Card from '../components/Card';
import Button from '../components/Button';
import FeedbackButtons from '../components/FeedbackButtons';

interface CoinPrice {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  image: string;
}

interface NewsItem {
  id: string;
  title: string;
  url: string;
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

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState<{
    coinPrices: CoinPrice[];
    marketNews: NewsItem[];
    aiInsight: AIInsight;
    meme: MemeItem;
  } | null>(null);
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

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price);
  };

  const formatMarketCap = (cap: number) => {
    if (cap >= 1e12) return `$${(cap / 1e12).toFixed(2)}T`;
    if (cap >= 1e9) return `$${(cap / 1e9).toFixed(2)}B`;
    if (cap >= 1e6) return `$${(cap / 1e6).toFixed(2)}M`;
    return `$${cap.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <Card>
          <div className="text-center">
            <p className="text-red-400 mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Retry</Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!dashboardData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Modern Header with Glassmorphism */}
      <header className="bg-slate-800/30 backdrop-blur-xl border-b border-slate-700/30 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Crypto Advisor
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-700/50 rounded-lg">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-slate-300 text-sm">Welcome, {user?.name}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={logout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* AI Insight Section - Full Width */}
        <div className="mb-6 sm:mb-8">
          <Card
            title="AI Insight of the Day"
            headerAction={
              dashboardData.aiInsight && (
                <FeedbackButtons
                  feedbackType="ai_insight"
                  itemId={dashboardData.aiInsight.id}
                />
              )
            }
            className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/30"
          >
            {dashboardData.aiInsight && (
              <div className="space-y-3">
                <p className="text-slate-200 text-base sm:text-lg leading-relaxed">
                  {dashboardData.aiInsight.content}
                </p>
                <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400 pt-2 border-t border-slate-700/50">
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                    {dashboardData.aiInsight.model || 'AI'}
                  </span>
                  <span>•</span>
                  <span>{formatDate(dashboardData.aiInsight.generatedAt)}</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Main Content Grid - 3 columns on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Coin Prices Section - Takes 2 columns on large screens */}
          <div className="lg:col-span-2">
            <Card
              title="Coin Prices"
              headerAction={
                dashboardData.coinPrices.length > 0 && (
                  <FeedbackButtons
                    feedbackType="coin_prices"
                    itemId="coin-prices-section"
                  />
                )
              }
            >
              <div className="space-y-3">
                {dashboardData.coinPrices.map((coin) => (
                  <div
                    key={coin.id}
                    className="flex items-center justify-between p-3 sm:p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/30 hover:border-indigo-500/30 group"
                  >
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative">
                        <img
                          src={coin.image}
                          alt={coin.name}
                          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-slate-600 group-hover:ring-indigo-400 transition-all"
                        />
                      </div>
                      <div>
                        <h4 className="font-semibold text-slate-100 text-sm sm:text-base">
                          {coin.name}
                        </h4>
                        <p className="text-xs sm:text-sm text-slate-400">{coin.symbol}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-100 text-sm sm:text-base">
                        {formatPrice(coin.current_price)}
                      </p>
                      <p
                        className={`text-xs sm:text-sm font-medium ${
                          coin.price_change_percentage_24h >= 0
                            ? 'text-green-400'
                            : 'text-red-400'
                        }`}
                      >
                        {coin.price_change_percentage_24h >= 0 ? '+' : ''}
                        {coin.price_change_percentage_24h.toFixed(2)}%
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {formatMarketCap(coin.market_cap)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Meme Section - Compact, takes 1 column on large screens */}
          {dashboardData.meme && (
            <div className="lg:col-span-1">
              <Card
                title="Fun Crypto Meme"
                headerAction={
                  <FeedbackButtons
                    feedbackType="meme"
                    itemId={dashboardData.meme.id}
                  />
                }
                className="h-full"
              >
                <div className="space-y-3">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-100 line-clamp-2">
                    {dashboardData.meme.title}
                  </h3>
                  <div className="bg-slate-700/30 rounded-lg p-2 overflow-hidden">
                    {dashboardData.meme.url ? (
                      <a
                        href={dashboardData.meme.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block hover:opacity-90 transition-opacity"
                      >
                        <img
                          src={dashboardData.meme.imageUrl}
                          alt={dashboardData.meme.title}
                          className="w-full h-auto max-h-48 sm:max-h-56 object-contain rounded-lg mx-auto"
                        />
                      </a>
                    ) : (
                      <img
                        src={dashboardData.meme.imageUrl}
                        alt={dashboardData.meme.title}
                        className="w-full h-auto max-h-48 sm:max-h-56 object-contain rounded-lg mx-auto"
                      />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 text-center">
                    via {dashboardData.meme.source}
                  </p>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Market News Section - Full Width Below */}
        <div className="mt-4 sm:mt-6">
          <Card
            title="Market News"
            headerAction={
              dashboardData.marketNews.length > 0 && (
                <FeedbackButtons
                  feedbackType="market_news"
                  itemId="market-news-section"
                />
              )
            }
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 max-h-[500px] overflow-y-auto pr-2">
              {dashboardData.marketNews.map((news) => (
                <a
                  key={news.id}
                  href={news.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block p-3 sm:p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/30 hover:border-indigo-500/30 group"
                >
                  <h4 className="font-semibold text-slate-100 text-sm sm:text-base group-hover:text-indigo-400 transition-colors mb-2 line-clamp-2">
                    {news.title}
                  </h4>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
                    <span className="truncate">{news.source.title}</span>
                    <span>•</span>
                    <span className="whitespace-nowrap">{formatDate(news.published_at)}</span>
                  </div>
                  {news.currencies && news.currencies.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {news.currencies.slice(0, 3).map((curr) => (
                        <span
                          key={curr.code}
                          className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs font-medium"
                        >
                          {curr.code}
                        </span>
                      ))}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

