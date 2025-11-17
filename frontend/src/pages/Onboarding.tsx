import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { onboardingAPI } from '../utils/apiService';
import Button from '../components/Button';
import Card from '../components/Card';

const INVESTOR_TYPES = [
  'HODLer',
  'Day Trader',
  'NFT Collector',
  'Swing Trader',
  'DeFi Investor',
  'Other',
];

const CONTENT_PREFERENCES = ['Market News', 'Charts', 'AI Insight', 'Fun'];

const POPULAR_ASSETS = [
  'Bitcoin',
  'Ethereum',
  'Binance Coin',
  'Cardano',
  'Solana',
  'Polkadot',
  'Dogecoin',
  'Polygon',
  'Avalanche',
  'Chainlink',
];

const Onboarding: React.FC = () => {
  const [interestedAssets, setInterestedAssets] = useState<string[]>([]);
  const [investorType, setInvestorType] = useState('');
  const [contentPreferences, setContentPreferences] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if already completed onboarding
    const checkStatus = async () => {
      try {
        const response = await onboardingAPI.getStatus();
        if (response.completed) {
          navigate('/dashboard');
        }
      } catch (error) {
        // Not completed, continue
      }
    };
    checkStatus();
  }, [navigate]);

  const toggleAsset = (asset: string) => {
    setInterestedAssets((prev) =>
      prev.includes(asset)
        ? prev.filter((a) => a !== asset)
        : [...prev, asset]
    );
  };

  const toggleContentPreference = (pref: string) => {
    setContentPreferences((prev) =>
      prev.includes(pref)
        ? prev.filter((p) => p !== pref)
        : [...prev, pref]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!investorType || interestedAssets.length === 0 || contentPreferences.length === 0) {
      return;
    }

    setIsLoading(true);
    try {
      await onboardingAPI.savePreferences({
        interestedAssets,
        investorType,
        contentPreferences,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to save preferences:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4">
      <div className="max-w-4xl mx-auto fade-in">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-2">
            Welcome! Let's personalize your experience
          </h1>
          <p className="text-slate-400">Tell us about your crypto interests</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Crypto Assets */}
          <Card title="What crypto assets are you interested in?">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-3">
                {POPULAR_ASSETS.map((asset) => (
                  <button
                    key={asset}
                    type="button"
                    onClick={() => toggleAsset(asset)}
                    className={`
                      px-4 py-2 rounded-lg font-medium transition-all
                      ${
                        interestedAssets.includes(asset)
                          ? 'bg-indigo-600 text-white shadow-lg'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }
                    `}
                  >
                    {asset}
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Investor Type */}
          <Card title="What type of investor are you?">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {INVESTOR_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setInvestorType(type)}
                  className={`
                    px-4 py-3 rounded-lg font-medium transition-all text-left
                    ${
                      investorType === type
                        ? 'bg-indigo-600 text-white shadow-lg ring-2 ring-indigo-400'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }
                  `}
                >
                  {type}
                </button>
              ))}
            </div>
          </Card>

          {/* Content Preferences */}
          <Card title="What kind of content would you like to see?">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {CONTENT_PREFERENCES.map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => toggleContentPreference(pref)}
                  className={`
                    px-4 py-3 rounded-lg font-medium transition-all
                    ${
                      contentPreferences.includes(pref)
                        ? 'bg-purple-600 text-white shadow-lg ring-2 ring-purple-400'
                        : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }
                  `}
                >
                  {pref}
                </button>
              ))}
            </div>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={
                !investorType ||
                interestedAssets.length === 0 ||
                contentPreferences.length === 0
              }
            >
              Complete Setup
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Onboarding;

