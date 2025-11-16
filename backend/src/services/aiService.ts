import axios from 'axios';

// OpenRouter API configuration (free tier available)
const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';
const HUGGINGFACE_API_BASE = 'https://api-inference.huggingface.co/models';

export interface AIInsight {
  id: string;
  content: string;
  generatedAt: string;
  model?: string;
}

/**
 * Get AI insight using OpenRouter (free tier)
 * Falls back to HuggingFace if OpenRouter fails
 */
export const getAIInsight = async (userPreferences?: {
  interestedAssets?: string[];
  investorType?: string;
}): Promise<AIInsight> => {
  // Try OpenRouter first
  try {
    return await getOpenRouterInsight(userPreferences);
  } catch (error) {
    console.error('OpenRouter failed, trying HuggingFace:', error);
    // Fallback to HuggingFace
    try {
      return await getHuggingFaceInsight(userPreferences);
    } catch (error) {
      console.error('HuggingFace failed, using fallback:', error);
      return getFallbackInsight();
    }
  }
};

/**
 * Get AI insight from OpenRouter
 */
const getOpenRouterInsight = async (userPreferences?: {
  interestedAssets?: string[];
  investorType?: string;
}): Promise<AIInsight> => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey) {
    throw new Error('OpenRouter API key not configured');
  }

  const assets = userPreferences?.interestedAssets?.join(', ') || 'cryptocurrency';
  const investorType = userPreferences?.investorType || 'investor';

  const prompt = `Provide a brief (2-3 sentences) daily crypto market insight for a ${investorType} interested in ${assets}. Make it actionable and relevant to today's market.`;

  const response = await axios.post(
    `${OPENROUTER_API_BASE}/chat/completions`,
    {
      model: 'meta-llama/llama-3.2-3b-instruct:free', // Free model
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 150,
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    }
  );

  const content = response.data.choices[0]?.message?.content || 'Unable to generate insight.';

  return {
    id: `insight-${Date.now()}`,
    content,
    generatedAt: new Date().toISOString(),
    model: 'OpenRouter (Llama 3.2)',
  };
};

/**
 * Get AI insight from HuggingFace (free tier)
 */
const getHuggingFaceInsight = async (userPreferences?: {
  interestedAssets?: string[];
  investorType?: string;
}): Promise<AIInsight> => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  const assets = userPreferences?.interestedAssets?.join(', ') || 'cryptocurrency';
  const investorType = userPreferences?.investorType || 'investor';

  const prompt = `Daily crypto insight for ${investorType}: ${assets}`;

  try {
    const response = await axios.post(
      `${HUGGINGFACE_API_BASE}/gpt2`,
      {
        inputs: prompt,
        parameters: {
          max_length: 100,
        },
      },
      {
        headers: {
          ...(apiKey && { 'Authorization': `Bearer ${apiKey}` }),
          'Content-Type': 'application/json',
        },
      }
    );

    const content = Array.isArray(response.data)
      ? response.data[0]?.generated_text || 'Market analysis unavailable.'
      : response.data?.generated_text || 'Market analysis unavailable.';

    return {
      id: `insight-${Date.now()}`,
      content: content.replace(prompt, '').trim() || 'Market analysis unavailable.',
      generatedAt: new Date().toISOString(),
      model: 'HuggingFace (GPT-2)',
    };
  } catch (error: any) {
    // HuggingFace free tier may have rate limits
    throw new Error('HuggingFace API error');
  }
};

/**
 * Fallback insight if all APIs fail
 */
const getFallbackInsight = (): AIInsight => {
  return {
    id: `insight-${Date.now()}`,
    content: 'Today\'s crypto market shows continued volatility. Stay informed and make decisions based on your risk tolerance and investment strategy.',
    generatedAt: new Date().toISOString(),
    model: 'Fallback',
  };
};

