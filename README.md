# AI Crypto Advisor

A personalized crypto investor dashboard with AI-curated content.

## Project Structure

```
ai-crypto-advisor/
├── frontend/          # React + Vite frontend
├── backend/           # Node.js + Express backend
└── package.json       # Monorepo root
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB (local or cloud instance)
- API Keys (optional, for live data):
  - OpenRouter API key (for AI insights) - https://openrouter.ai/keys
  - HuggingFace API key (optional fallback) - https://huggingface.co/settings/tokens
  - CryptoPanic API key (optional, for better rate limits) - https://cryptopanic.com/developers/api/

### Install Dependencies

```bash
npm run install:all
```

### Environment Setup

1. **Backend Environment Variables**

   Copy the example file and configure:
   ```bash
   cd backend
   cp .env
   ```

   Edit `.env` and set:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - A secure random string for JWT tokens
   - `OPENROUTER_API_KEY` - (Optional) For AI insights
   - `HUGGINGFACE_API_KEY` - (Optional) Fallback for AI insights
   - `CRYPTOPANIC_API_KEY` - (Optional) For better news API rate limits

2. **Frontend Environment Variables**

   Copy the example file:
   ```bash
   cd frontend
   cp .env
   ```

   Edit `.env` and set:
   - `VITE_API_URL` - Backend API URL (default: http://localhost:5001)

### Development

```bash
# Run both frontend and backend
npm run dev

# Or run separately
npm run dev:frontend  # Frontend on port 3000
npm run dev:backend   # Backend on port 5001
```

**Note:** The app works without API keys using fallback data, but for live data you'll need to configure the API keys.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: Node.js + TypeScript
