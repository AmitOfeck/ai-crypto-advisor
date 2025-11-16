import express, { Express } from 'express';
import authRoutes from './routes/authRoutes';

// Express app setup
const app: Express = express();

// JSON middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);

export default app;
