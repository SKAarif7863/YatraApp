import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import passport from 'passport';

import { connectDB } from './utils/connectDB.js';
import authRoutes from './routes/authRoutes.js';
import itemRoutes from './routes/itemRoutes.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import './utils/logger.js';
import './config/passport.js';

dotenv.config();

const app = express();

app.set('trust proxy', 1);

const corsOrigins = (process.env.CORS_ORIGIN || 'http://localhost:8080').split(',');
app.use(cors({ origin: corsOrigins, credentials: true }));
app.use(helmet());
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan('dev'));
app.use(passport.initialize());

const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 100, standardHeaders: true, legacyHeaders: false });
app.use('/api/auth', authLimiter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', authRoutes);
app.use('/api/items', itemRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 4000;

async function start() {
  await connectDB(process.env.MONGODB_URI);
  if (process.env.NODE_ENV !== 'test') {
    app.listen(PORT, () => {
      // eslint-disable-next-line no-console
      console.log(`API server running on http://localhost:${PORT}`);
    });
  }
}

if (process.env.NODE_ENV !== 'test') {
  start();
}

export default app;
