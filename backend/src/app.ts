import express, { Express } from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';
import onboardingRoutes from './routes/onboardingRoutes';

// Express app setup
const app: Express = express();

// JSON middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/onboarding', onboardingRoutes);

export default app;
