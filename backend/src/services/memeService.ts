// Meme service - using static JSON fallback
// In production, you could integrate Reddit API or other meme sources

export interface MemeItem {
  id: string;
  title: string;
  imageUrl: string;
  source: string;
}

/**
 * Get a random crypto meme
 */
export const getRandomMeme = async (): Promise<MemeItem> => {
  // Static meme collection (fallback)
  // In production, you could fetch from Reddit r/cryptomemes or similar
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

  // Return random meme
  const randomIndex = Math.floor(Math.random() * memes.length);
  return memes[randomIndex];
};

/**
 * Get meme from Reddit (future implementation)
 * TODO: Implement Reddit API integration
 */
export const getRedditMeme = async (): Promise<MemeItem | null> => {
  // TODO: Implement Reddit API scraping
  // For now, return null to use fallback
  return null;
};

