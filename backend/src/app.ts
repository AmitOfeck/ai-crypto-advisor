import express, { Express } from 'express';
import authRoutes from './routes/authRoutes';
import userRoutes from './routes/userRoutes';

// Express app setup
const app: Express = express();

// JSON middleware
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);

export default app;
