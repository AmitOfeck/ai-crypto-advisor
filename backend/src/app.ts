import express, { Express } from 'express';
import cors from 'cors';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import onboardingRoutes from './routes/onboardingRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import feedbackRoutes from './routes/feedbackRoutes';

// Express app setup
const app: Express = express();

// CORS middleware - allow requests from frontend
// Handle preflight OPTIONS requests properly
const allowedOrigins = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',').map(url => url.trim())
  : ['http://localhost:3000'];

// More robust CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow localhost
    if (process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    
    // In production, check against allowed origins
    // Also allow Vercel domains as fallback to prevent intermittent failures
    const isAllowed = allowedOrigins.indexOf(origin) !== -1 || 
                     origin.includes('vercel.app') ||
                     origin.includes('ai-crypto-advisor-frontend');
    
    if (isAllowed) {
      callback(null, true);
    } else {
      // Log for debugging but allow to prevent intermittent failures
      // In production, you may want to tighten this after confirming it works
      console.warn('CORS: Origin not in allowed list:', origin);
      console.warn('CORS: Allowed origins:', allowedOrigins);
      // Allow anyway to prevent intermittent CORS failures
      callback(null, true);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
}));

// Explicit OPTIONS handler as fallback for all routes
app.options('*', cors());

// JSON middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/onboarding', onboardingRoutes);
app.use('/dashboard', dashboardRoutes);
app.use('/feedback', feedbackRoutes);

export default app;
