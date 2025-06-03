import dotenv from 'dotenv';
import path from 'path';
import Joi from 'joi';

// Load .env file from backend root
dotenv.config({ path: path.join(__dirname, '../../.env') });

// Define validation schema for environment variables
const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(9000),
    DATABASE_URL: Joi.string().required().uri({
      scheme: [
        'postgresql',
        'postgres'
      ]
    }).description('PostgreSQL DB connection URL'),
    JWT_SECRET: Joi.string().required().min(32).description('JWT secret key (min 32 chars)'),
    JWT_EXPIRES_IN: Joi.string().default('1d').description('JWT access token expiry'),
    JWT_REFRESH_SECRET: Joi.string().required().min(32).description('JWT refresh secret key (min 32 chars)'),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d').description('JWT refresh token expiry'),
    CORS_ORIGIN: Joi.string().allow('').description('Comma separated list of allowed origins, or * for all. Default is empty string, meaning restrictive unless in dev with *.'),
    LOG_LEVEL: Joi.string().valid('error', 'warn', 'info', 'http', 'verbose', 'debug', 'silly').default('info'),
    RATE_LIMIT_WINDOW_MS: Joi.number().integer().positive().default(15 * 60 * 1000), // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: Joi.number().integer().positive().default(100),
    FRONTEND_URL: Joi.string().uri().required().description('Main frontend URL for redirects, emails etc.'),
  })
  .unknown(); // Allow other variables not defined in schema but log them

const { value: envVars, error, warning } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

if (warning) {
  console.warn(`Config validation warning: ${warning.message}`);
}

// Helper function to parse comma-separated strings or return a default
const getCorsOrigin = (envVar?: string): string => {
  if (envVars.NODE_ENV === 'development' && (!envVar || envVar === '*')) {
    return '*'; // Allow all in dev if CORS_ORIGIN is '*' or not set
  }
  return envVar || ''; // Default to empty string (restrictive) if not set and not dev with '*'
};

const config = {
  env: envVars.NODE_ENV as 'production' | 'development' | 'test',
  port: envVars.PORT as number,
  db: {
    url: envVars.DATABASE_URL as string,
  },
  jwt: {
    secret: envVars.JWT_SECRET as string,
    expiresIn: envVars.JWT_EXPIRES_IN as string,
    refreshSecret: envVars.JWT_REFRESH_SECRET as string,
    refreshExpiresIn: envVars.JWT_REFRESH_EXPIRES_IN as string,
  },
  corsOrigin: getCorsOrigin(envVars.CORS_ORIGIN),
  logLevel: envVars.LOG_LEVEL as string,
  isDevelopment: envVars.NODE_ENV === 'development',
  isProduction: envVars.NODE_ENV === 'production',
  isTest: envVars.NODE_ENV === 'test',
  rateLimitWindowMs: envVars.RATE_LIMIT_WINDOW_MS as number,
  rateLimitMaxRequests: envVars.RATE_LIMIT_MAX_REQUESTS as number,
  frontendUrl: envVars.FRONTEND_URL as string,
};

export default config;
