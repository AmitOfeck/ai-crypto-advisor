import axios from 'axios';

// OpenRouter API configuration (free tier available)
const OPENROUTER_API_BASE = 'https://openrouter.ai/api/v1';
// HuggingFace Inference API (using router endpoint compatible with OpenAI format)
const HUGGINGFACE_API_BASE = 'https://router.huggingface.co/v1';

export interface AIInsight {
  id: string;
  content: string;
  generatedAt: string;
  model?: string;
}

/**
 * Get AI insight using OpenRouter and HuggingFace
 * Tries OpenRouter first, then HuggingFace, then fallback
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
      if (error.message?.includes('rate limit') || error.response?.status === 429) {
        console.warn('OpenRouter rate limited. Trying HuggingFace...');
      } else {
        console.warn('OpenRouter failed:', error.message || error);
      }
      // Continue to HuggingFace fallback
    }
  }

  // Fallback to HuggingFace if OpenRouter fails AND key is configured
  const huggingFaceKey = process.env.HUGGINGFACE_API_KEY;
  if (huggingFaceKey && huggingFaceKey !== 'your-huggingface-api-key-here') {
    try {
      return await getHuggingFaceInsight(userPreferences);
    } catch (error: any) {
      console.warn('HuggingFace failed:', error.message || error);
    }
  }

  // Final fallback to personalized static insight (only if both APIs fail)
  console.warn('Both OpenRouter and HuggingFace failed. Using fallback.');
  return getFallbackInsight(userPreferences);
};

/**
 * Get AI insight from OpenRouter (fast - no retries for rate limits)
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
    // If rate limited, throw immediately for fast fallback (no retries)
    if (error.response?.status === 429) {
      console.warn('OpenRouter rate limited (429). Falling back immediately.');
      throw new Error('OpenRouter rate limit exceeded');
    }
    // For other errors, throw immediately
    throw error;
  }
};

/**
 * Get AI insight from HuggingFace (using router endpoint with OpenAI-compatible format)
 */
const getHuggingFaceInsight = async (userPreferences?: {
  interestedAssets?: string[];
  investorType?: string;
}): Promise<AIInsight> => {
  const apiKey = process.env.HUGGINGFACE_API_KEY;
  
  if (!apiKey || apiKey === 'your-huggingface-api-key-here') {
    throw new Error('HuggingFace API key not configured');
  }

  const assets = userPreferences?.interestedAssets?.join(', ') || 'cryptocurrency';
  const investorType = userPreferences?.investorType || 'investor';

  const prompt = `Provide a brief (2-3 sentences) daily crypto market insight for a ${investorType} interested in ${assets}. Make it actionable and relevant to today's market.`;

  try {
    // Use HuggingFace router endpoint with OpenAI-compatible chat completions format
    const response = await axios.post(
      `${HUGGINGFACE_API_BASE}/chat/completions`,
      {
        model: 'meta-llama/Llama-3.2-3B-Instruct', // Using a model available on HuggingFace router
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 150,
        temperature: 0.7,
      },
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        timeout: 20000, // 20 second timeout for inference
      }
    );

    const content = response.data.choices?.[0]?.message?.content || 'Unable to generate insight.';

    if (!content || content.trim().length < 20) {
      throw new Error('HuggingFace generated invalid content');
    }

    return {
      id: `insight-${Date.now()}`,
      content: content.trim(),
      generatedAt: new Date().toISOString(),
      model: 'HuggingFace (Llama 3.2)',
    };
  } catch (error: any) {
    console.error('HuggingFace API error:', error.message);
    if (error.response) {
      console.error('HuggingFace response status:', error.response.status);
      console.error('HuggingFace response data:', error.response.data);
      
      // Check for specific error types
      if (error.response.status === 400) {
        const errorData = error.response.data?.error;
        if (errorData?.code === 'model_not_supported' || errorData?.code === 'model_not_found') {
          console.error('HuggingFace Error: Model not available or token lacks Inference Providers permissions.');
          console.error('Solution: Enable "Make calls to Inference Providers" permission in your HuggingFace token settings.');
        }
      }
    }
    throw new Error('HuggingFace API error');
  }
};

/**
 * Fallback insight if both APIs fail (personalized based on user preferences)
 */
const getFallbackInsight = (userPreferences?: {
  interestedAssets?: string[];
  investorType?: string;
}): AIInsight => {
  const assets = userPreferences?.interestedAssets?.length 
    ? userPreferences.interestedAssets.join(', ')
    : 'cryptocurrency';
  
  const investorType = userPreferences?.investorType || 'investor';
  
  // Generate personalized fallback content based on user preferences
  let content = `Today's crypto market shows continued volatility. `;
  
  if (userPreferences?.interestedAssets && userPreferences.interestedAssets.length > 0) {
    content += `For ${investorType}s interested in ${assets}, `;
  } else {
    content += `For ${investorType}s, `;
  }
  
  content += `stay informed and make decisions based on your risk tolerance and investment strategy. Monitor market trends and consider your long-term goals when making investment decisions.`;
  
  return {
    id: `insight-${Date.now()}`,
    content,
    generatedAt: new Date().toISOString(),
    model: 'Fallback',
  };
};

