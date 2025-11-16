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
 * Falls back to HuggingFace if OpenRouter fails, then to static fallback
 */
export const getAIInsight = async (userPreferences?: {
  interestedAssets?: string[];
  investorType?: string;
}): Promise<AIInsight> => {
  // Try OpenRouter first if API key is configured
  const openRouterKey = process.env.OPENROUTER_API_KEY;
  if (openRouterKey && openRouterKey !== 'your-openrouter-api-key-here') {
    try {
      return await getOpenRouterInsight(userPreferences);
    } catch (error: any) {
      // Log specific error type for debugging
      if (error.message?.includes('rate limit')) {
        console.warn('OpenRouter rate limit exceeded, trying HuggingFace...');
      } else {
        console.warn('OpenRouter failed, trying HuggingFace:', error.message || error);
      }
    }
  } else {
    console.log('OpenRouter API key not configured, trying HuggingFace...');
  }

  // Fallback to HuggingFace if OpenRouter fails or not configured
  const huggingFaceKey = process.env.HUGGINGFACE_API_KEY;
  if (huggingFaceKey && huggingFaceKey !== 'your-huggingface-api-key-here') {
    try {
      return await getHuggingFaceInsight(userPreferences);
    } catch (error) {
      console.warn('HuggingFace failed, using fallback:', error);
    }
  } else {
    console.log('HuggingFace API key not configured, using fallback insight...');
  }

  // Final fallback to static insight
  return getFallbackInsight();
};

/**
 * Sleep helper for retry delays
 */
const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Get AI insight from OpenRouter with retry logic for rate limits
 */
const getOpenRouterInsight = async (userPreferences?: {
  interestedAssets?: string[];
  investorType?: string;
}): Promise<AIInsight> => {
  const apiKey = process.env.OPENROUTER_API_KEY;
  
  if (!apiKey || apiKey === 'your-openrouter-api-key-here') {
    throw new Error('OpenRouter API key not configured');
  }

  const assets = userPreferences?.interestedAssets?.join(', ') || 'cryptocurrency';
  const investorType = userPreferences?.investorType || 'investor';

  const prompt = `Provide a brief (2-3 sentences) daily crypto market insight for a ${investorType} interested in ${assets}. Make it actionable and relevant to today's market.`;

  const maxRetries = 3;
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
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
    } catch (error: any) {
      lastError = error;
      
      // Check if it's a rate limit error (429)
      if (error.response?.status === 429) {
        const retryAfter = error.response?.headers['retry-after'] 
          ? parseInt(error.response.headers['retry-after']) * 1000 
          : Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
        
        if (attempt < maxRetries - 1) {
          console.log(`OpenRouter rate limited (429). Retrying in ${retryAfter}ms... (attempt ${attempt + 1}/${maxRetries})`);
          await sleep(retryAfter);
          continue; // Retry
        } else {
          console.error('OpenRouter rate limit exceeded after all retries');
          throw new Error('OpenRouter rate limit exceeded. Please try again in a few moments.');
        }
      }
      
      // For other errors, throw immediately
      throw error;
    }
  }

  // Should never reach here, but TypeScript needs it
  throw lastError || new Error('Failed to get OpenRouter insight');
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

