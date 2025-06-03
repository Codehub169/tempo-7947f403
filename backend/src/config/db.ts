import { PrismaClient } from '@prisma/client';
import config from './index';
import logger from './logger'; // Assuming logger.ts will be created in the same directory

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

// Initialize Prisma Client
// In development, use a global variable to preserve the PrismaClient instance across HMR reloads.
// In production, always create a new instance.
const prismaClient = global.prisma || new PrismaClient({
  log: config.isDevelopment
    ? [{ emit: 'event', level: 'query' }, { emit: 'event', level: 'info' }, { emit: 'event', level: 'warn' }, { emit: 'event', level: 'error' }]
    : [{ emit: 'event', level: 'error' }],
});

if (config.isDevelopment) {
  global.prisma = prismaClient;

  prismaClient.$on('query', (e) => {
    logger.debug(`Query: ${e.query}`);
    logger.debug(`Params: ${e.params}`);
    logger.debug(`Duration: ${e.duration}ms`);
  });

  prismaClient.$on('info', (e) => {
    logger.info(e.message);
  });

  prismaClient.$on('warn', (e) => {
    logger.warn(e.message);
  });

  prismaClient.$on('error', (e) => {
    logger.error(e.message);
  });
}

/**
 * Connects to the database using Prisma.
 * This function is implicitly called when Prisma Client sends its first query.
 * Explicit connection can be done if needed, e.g., for health checks.
 */
async function connectDB(): Promise<void> {
  try {
    await prismaClient.$connect();
    logger.info('Successfully connected to the database via Prisma.');
  } catch (error) {
    logger.error('Failed to connect to the database via Prisma:', error);
    process.exit(1); // Exit process on connection failure
  }
}

/**
 * Disconnects from the database.
 * Typically called during graceful shutdown.
 */
async function disconnectDB(): Promise<void> {
  try {
    await prismaClient.$disconnect();
    logger.info('Successfully disconnected from the database via Prisma.');
  } catch (error) {
    logger.error('Failed to disconnect from the database via Prisma:', error);
  }
}

export { prismaClient, connectDB, disconnectDB };
