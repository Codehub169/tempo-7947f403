import express, { Application, Request, Response, NextFunction } from 'express';
import 'express-async-errors'; // Handles async errors without try-catch blocks in route handlers
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import xss from 'xss-clean'; 
import rateLimit from 'express-rate-limit';
import httpStatus from 'http-status-codes';

import config from './config';
import logger from './config/logger'; // Assuming logger.ts will be created

// A simple custom error class for API errors
class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true, stack = '') {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const app: Application = express();

// HTTP request logger middleware (Morgan)
if (config.env !== 'test') {
  app.use(morgan(config.env === 'development' ? 'dev' : 'combined', { 
    stream: { write: (message) => logger.http(message.trim()) }
  }));
}

// Set security HTTP headers (Helmet)
app.use(helmet());

// Enable CORS - Cross Origin Resource Sharing
const corsOrigins = config.corsOrigin ? config.corsOrigin.split(',').map(origin => origin.trim()) : [];
const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || corsOrigins.includes(origin) || (config.env === 'development' && corsOrigins.includes('*'))) {
      callback(null, true);
    } else {
      logger.warn(`CORS: Blocked origin - ${origin}. Allowed: ${corsOrigins.join(', ')}`);
      callback(new ApiError(httpStatus.FORBIDDEN, 'Not allowed by CORS'));
    }
  },
  credentials: true,
};
app.use(cors(corsOptions));

// Parse json request body
app.use(express.json({ limit: '10mb' }));

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitize request data (XSS)
app.use(xss());

// Gzip compression
app.use(compression());

// Cookie parser
app.use(cookieParser());

// Rate limiting to prevent abuse
if (config.env === 'production' || config.env === 'development') { // Apply in dev too for testing
  const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    standardHeaders: true, 
    legacyHeaders: false, 
    handler: (req, res, next, options) => {
        throw new ApiError(options.statusCode, options.message);
    },
    message: 'Too many requests from this IP, please try again after some time.',
  });
  app.use('/api', limiter); // Apply to all API routes
}

// API Health Check Route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(httpStatus.OK).json({ 
    status: 'UP', 
    timestamp: new Date().toISOString(),
    message: 'CRM API is healthy!'
  });
});

// Placeholder for API v1 routes - to be added later
// import v1Routes from './routes'; 
// app.use('/api/v1', v1Routes);

// Send back a 404 error for any unknown api request that starts with /api
app.use('/api/*', (req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(httpStatus.NOT_FOUND, `API Route Not found: ${req.originalUrl}`));
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  let error = err;
  if (!(error instanceof ApiError)) {
    const statusCode = (error as any).statusCode || httpStatus.INTERNAL_SERVER_ERROR;
    const message = error.message || httpStatus[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  const { statusCode, message: errMsg, stack } = error as ApiError;

  logger.error(`[${statusCode}] ${errMsg} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  if (config.env === 'development' && stack) {
    logger.error(stack);
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    message: errMsg,
    ...(config.env === 'development' && { stack: stack?.split('\n') }), // Send stack as array in dev
  });
});

export default app;
