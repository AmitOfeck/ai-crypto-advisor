import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useDashboard } from '../hooks/useDashboard';
import { useFormatting } from '../hooks/useFormatting';
import Card from '../components/Card';
import Button from '../components/Button';
import FeedbackButtons from '../components/FeedbackButtons';

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { dashboardData, isLoading, error } = useDashboard();
  const { formatPrice, formatMarketCap, formatDate } = useFormatting();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-slate-400">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-cyan-950 to-slate-950">
      {/* Neon Cyber Header with Glow Effects */}
      <header className="bg-slate-900/40 backdrop-blur-xl border-b border-cyan-500/20 sticky top-0 z-50 shadow-lg shadow-cyan-500/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg shadow-cyan-500/50">
                <span className="text-white font-bold text-lg">AI</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 via-teal-400 to-amber-400 bg-clip-text text-transparent">
                Crypto Advisor
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-slate-800/60 rounded-lg border border-cyan-500/20">
                <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse shadow-sm shadow-cyan-400/50"></div>
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
              className="bg-gradient-to-br from-cyan-900/20 to-teal-900/20 border-cyan-500/30 h-full shadow-lg shadow-cyan-500/10"
            >
              {dashboardData.aiInsight && (
                <div className="space-y-3 flex flex-col h-full">
                  <p className="text-slate-200 text-base sm:text-lg leading-relaxed flex-grow">
                    {dashboardData.aiInsight.content}
                  </p>
                    <div className="flex items-center gap-3 text-xs sm:text-sm text-slate-400 pt-3 border-t border-slate-700/50">
                      <span className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full shadow-sm shadow-cyan-400/50"></span>
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
                        className="flex items-center justify-between p-3 sm:p-4 bg-slate-800/40 rounded-lg hover:bg-slate-800/60 transition-all duration-200 border border-slate-700/30 hover:border-cyan-500/40 hover:shadow-md hover:shadow-cyan-500/20 group"
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="relative">
                            <img
                              src={coin.image}
                              alt={coin.name}
                              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full ring-2 ring-slate-600 group-hover:ring-cyan-400 transition-all shadow-sm group-hover:shadow-cyan-400/30"
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
                                ? 'text-amber-400'
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
                    {dashboardData.marketNews.map((news) => {
                      const NewsContent = (
                        <>
                          <h4 className={`font-semibold text-slate-100 text-sm sm:text-base mb-2 line-clamp-2 ${news.url ? 'group-hover:text-cyan-400 transition-colors' : ''}`}>
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
                                  className="px-2 py-0.5 bg-cyan-500/20 text-cyan-300 rounded text-xs font-medium border border-cyan-500/30"
                                >
                                  {curr.code}
                                </span>
                              ))}
                            </div>
                          )}
                        </>
                      );

                      return news.url ? (
                        <a
                          key={news.id}
                          href={news.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="block p-3 sm:p-4 bg-slate-800/40 rounded-lg hover:bg-slate-800/60 transition-all duration-200 border border-slate-700/30 hover:border-cyan-500/40 hover:shadow-md hover:shadow-cyan-500/20 group h-fit cursor-pointer"
                        >
                          {NewsContent}
                        </a>
                      ) : (
                        <div
                          key={news.id}
                          className="block p-3 sm:p-4 bg-slate-700/30 rounded-lg hover:bg-slate-700/50 transition-all duration-200 border border-slate-700/30 hover:border-slate-600/50 h-fit"
                        >
                          {NewsContent}
                        </div>
                      );
                    })}
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

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

