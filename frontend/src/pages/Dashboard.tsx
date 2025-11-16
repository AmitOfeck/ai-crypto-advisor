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
    preferences?: {
      investorType: string;
      contentPreferences: string[];
    } | null;
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

  const formatMarketCap = (cap: number | null | undefined) => {
    if (!cap || cap === null || cap === undefined) return 'N/A';
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

  // Get user's content preferences
  const contentPreferences = dashboardData?.preferences?.contentPreferences || [];
  
  // Helper to check if a section should be shown
  const shouldShowSection = (section: string) => contentPreferences.includes(section);

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
        {/* Balanced 2x2 Grid Layout - All sections with equal visual weight */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Top Row: AI Insight (2 cols) + Meme (1 col) */}
          
          {/* AI Insight Section - Takes 2 columns */}
          <div className="lg:col-span-2">
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
              className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border-indigo-500/30 h-full"
            >
              {dashboardData.aiInsight && (
                <div className="space-y-3 flex flex-col h-full">
                  <p className="text-slate-200 text-base sm:text-lg leading-relaxed flex-grow">
                    {dashboardData.aiInsight.content}
                  </p>
                  <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400 pt-3 border-t border-slate-700/50">
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

          {/* Fun Section (Meme) - Takes 1 column, same row as AI Insight */}
          {shouldShowSection('Fun') && (
            <div className="lg:col-span-1">
              <Card
                title="Fun Crypto Meme"
                headerAction={
                  dashboardData.meme ? (
                    <FeedbackButtons
                      feedbackType="meme"
                      itemId={dashboardData.meme.id}
                    />
                  ) : null
                }
                className="h-full flex flex-col"
              >
                {dashboardData.meme ? (
                  <div className="space-y-3 flex flex-col flex-grow">
                    <h3 className="text-sm sm:text-base font-semibold text-slate-100 line-clamp-2">
                      {dashboardData.meme.title}
                    </h3>
                    <div className="bg-slate-700/30 rounded-lg p-2 overflow-hidden flex-grow flex items-center justify-center min-h-0">
                      {dashboardData.meme.url ? (
                        <a
                          href={dashboardData.meme.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block hover:opacity-90 transition-opacity w-full h-full flex items-center justify-center"
                        >
                          <img
                            src={dashboardData.meme.imageUrl}
                            alt={dashboardData.meme.title}
                            className="w-full h-full max-h-[280px] object-contain rounded-lg"
                          />
                        </a>
                      ) : (
                        <img
                          src={dashboardData.meme.imageUrl}
                          alt={dashboardData.meme.title}
                          className="w-full h-full max-h-[280px] object-contain rounded-lg"
                        />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 text-center">
                      via {dashboardData.meme.source}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center py-8">
                    <p className="mb-2">Meme content will be displayed here.</p>
                    <p className="text-sm">Stay tuned for updates!</p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Bottom Row: Charts (1 col) + Market News/Social (2 cols) */}
          
          {/* Charts Section (Coin Prices) - Takes 1 column */}
          {shouldShowSection('Charts') && (
            <div className="lg:col-span-1">
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
                className="h-full flex flex-col"
              >
                {dashboardData.coinPrices.length > 0 ? (
                  <div className="space-y-3 flex-grow overflow-y-auto max-h-[500px] pr-2">
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
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center py-8">
                    <p className="mb-2">Coin price data will be displayed here.</p>
                    <p className="text-sm">Stay tuned for updates!</p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Market News Section - Takes 2 columns */}
          {shouldShowSection('Market News') && (
            <div className="lg:col-span-2">
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
                className="h-full flex flex-col"
              >
                {dashboardData.marketNews.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 flex-grow overflow-y-auto max-h-[500px] pr-2">
                    {dashboardData.marketNews.map((news) => (
                      <a
                        key={news.id}
                        href={news.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 sm:p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/30 hover:border-indigo-500/30 group h-fit"
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
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center py-8">
                    <p className="mb-2">Market news will be displayed here.</p>
                    <p className="text-sm">Stay tuned for updates!</p>
                  </div>
                )}
              </Card>
            </div>
          )}

          {/* Social Section - Takes 2 columns */}
          {shouldShowSection('Social') && (
            <div className={`${shouldShowSection('Market News') ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
              <Card
                title="Social Insights"
                className="h-full flex flex-col"
              >
                <div className="flex flex-col items-center justify-center h-full text-slate-400 text-center py-8">
                  <div className="mb-4">
                    <svg className="w-16 h-16 mx-auto text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <p className="mb-2 text-lg font-medium">Social insights coming soon!</p>
                  <p className="text-sm">Community activity, trending discussions, and social sentiment will be displayed here.</p>
                </div>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

