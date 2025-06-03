import app from './app';
import config from './config';
import logger from './config/logger'; // Assuming logger.ts will be created
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
let server: any;

async function main() {
  try {
    // Connect to the database
    await prisma.$connect();
    logger.info('Successfully connected to the database.');

    server = app.listen(config.port, () => {
      logger.info(`Server running on port ${config.port} in ${config.env} mode`);
      logger.info(`API available at http://localhost:${config.port}/api`);
    });
  } catch (error) {
    logger.error('Failed to connect to the database or start server:', error);
    await prisma.$disconnect().catch(e => logger.error('Failed to disconnect prisma on startup error', e));
    process.exit(1);
  }

  const exitHandler = async () => {
    if (server) {
      server.close(async () => {
        logger.info('Server closed');
        await prisma.$disconnect().catch(e => logger.error('Failed to disconnect prisma during exit', e));
        logger.info('Database connection closed');
        process.exit(0);
      });
    } else {
      await prisma.$disconnect().catch(e => logger.error('Failed to disconnect prisma during exit (no server)', e));
      process.exit(0);
    }
  };

  const unexpectedErrorHandler = async (error: Error) => {
    logger.error('Unexpected error:', error);
    // No need to disconnect prisma here if exitHandler will do it
    // await prisma.$disconnect(); 
    await exitHandler();
  };

  process.on('uncaughtException', unexpectedErrorHandler);
  process.on('unhandledRejection', (reason: {} | null | undefined, promise: Promise<any>) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Cast reason to Error if it's not already, or create a new one
    const error = reason instanceof Error ? reason : new Error(`Unhandled Rejection: ${reason}`);
    unexpectedErrorHandler(error);
  });

  process.on('SIGTERM', async () => {
    logger.info('SIGTERM received');
    await exitHandler();
  });

  process.on('SIGINT', async () => {
    logger.info('SIGINT received');
    await exitHandler();
  });
}

main();
