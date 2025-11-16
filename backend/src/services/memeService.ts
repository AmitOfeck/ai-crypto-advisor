import axios from 'axios';

export interface MemeItem {
  id: string;
  title: string;
  imageUrl: string;
  source: string;
  url?: string;
}

/**
 * Get a random crypto meme from Reddit
 * Falls back to static memes if Reddit fails
 */
export const getRandomMeme = async (): Promise<MemeItem> => {
  // Try Reddit first
  try {
    const redditMeme = await getRedditMeme();
    if (redditMeme) {
      return redditMeme;
    }
  } catch (error) {
    console.warn('Reddit API failed, using fallback memes:', error);
  }

  // Fallback to static memes
  return getFallbackMeme();
};

/**
 * Get meme from Reddit r/cryptomemes
 * Reddit JSON API (no auth required for public data)
 */
const getRedditMeme = async (): Promise<MemeItem | null> => {
  try {
    // Reddit JSON API - get hot posts from cryptomemes subreddit
    // Try with www first, fallback to direct domain if DNS fails
    let response;
    try {
      response = await axios.get('https://www.reddit.com/r/cryptomemes/hot.json', {
        params: {
          limit: 25,
        },
        headers: {
          'User-Agent': 'AI-Crypto-Advisor/1.0',
        },
        timeout: 5000, // 5 second timeout
      });
    } catch (dnsError: any) {
      // If DNS fails, try without www
      if (dnsError.code === 'ENOTFOUND' || dnsError.message?.includes('getaddrinfo')) {
        console.warn('Reddit www failed, trying direct domain...');
        response = await axios.get('https://reddit.com/r/cryptomemes/hot.json', {
          params: {
            limit: 25,
          },
          headers: {
            'User-Agent': 'AI-Crypto-Advisor/1.0',
          },
          timeout: 5000,
        });
      } else {
        throw dnsError;
      }
    }

    const posts = response.data?.data?.children || [];
    
    // Filter for image posts only
    const imagePosts = posts.filter((post: any) => {
      const data = post.data;
      return (
        data.post_hint === 'image' ||
        data.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ||
        (data.preview && data.preview.images && data.preview.images[0])
      );
    });

    if (imagePosts.length === 0) {
      return null;
    }

    // Get random image post
    const randomPost = imagePosts[Math.floor(Math.random() * imagePosts.length)];
    const postData = randomPost.data;

    // Extract image URL
    let imageUrl = postData.url;
    if (postData.preview?.images?.[0]?.source?.url) {
      imageUrl = postData.preview.images[0].source.url.replace(/&amp;/g, '&');
    }

    return {
      id: postData.id,
      title: postData.title,
      imageUrl: imageUrl,
      source: 'Reddit r/cryptomemes',
      url: `https://reddit.com${postData.permalink}`,
    };
  } catch (error: any) {
    console.error('Reddit API error:', error.message);
    return null;
  }
};

/**
 * Fallback static memes
 */
const getFallbackMeme = (): MemeItem => {
  const memes: MemeItem[] = [
    {
      id: '1',
      title: 'HODL Strong',
      imageUrl: 'https://via.placeholder.com/400x300?text=HODL+Strong+Meme',
      source: 'Crypto Memes',
    },
    {
      id: '2',
      title: 'When Bitcoin Dips',
      imageUrl: 'https://via.placeholder.com/400x300?text=When+BTC+Dips',
      source: 'Crypto Memes',
    },
    {
      id: '3',
      title: 'Diamond Hands',
      imageUrl: 'https://via.placeholder.com/400x300?text=Diamond+Hands',
      source: 'Crypto Memes',
    },
    {
      id: '4',
      title: 'To the Moon',
      imageUrl: 'https://via.placeholder.com/400x300?text=To+the+Moon',
      source: 'Crypto Memes',
    },
    {
      id: '5',
      title: 'Buy the Dip',
      imageUrl: 'https://via.placeholder.com/400x300?text=Buy+the+Dip',
      source: 'Crypto Memes',
    },
  ];

  const randomIndex = Math.floor(Math.random() * memes.length);
  return memes[randomIndex];
};
