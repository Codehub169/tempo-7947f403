import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { config } from '../config';
import ApiError from '../utils/ApiError';
import { logger } from '../config/logger';
import { prismaClient } from '../config/db';
import { TokenType } from '@prisma/client'; // Assuming Prisma generates this
import { ITokenPayload } from '../services/auth.service'; // Import from auth.service

// Define a custom request type that includes the user property
export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
    // Add other properties you expect on req.user
  };
}

/**
 * Middleware to authenticate users using JWT.
 * Verifies the token from the Authorization header.
 * Populates `req.user` with user details upon successful authentication.
 */
export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Access token is missing'));
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret) as ITokenPayload;

    // Check if token is an ACCESS token
    if (decoded.type !== TokenType.ACCESS) {
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid token type'));
    }

    // Optional: Check against DB if token is blacklisted or still valid (more secure for session management)
    const tokenDoc = await prismaClient.token.findFirst({
        where: { token, type: TokenType.ACCESS, userId: decoded.sub, blacklisted: false }
    });
    if (!tokenDoc) {
        logger.warn(`Access token not found in DB or blacklisted for user ${decoded.sub}`);
        return next(new ApiError(httpStatus.UNAUTHORIZED, 'Access token is invalid or has expired'));
    }

    // Fetch user details (could be selective)
    const user = await prismaClient.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, name: true, role: true /* other necessary fields */ },
    });

    if (!user) {
      logger.warn(`User not found for token sub: ${decoded.sub}`);
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'User not found'));
    }

    req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        // name: user.name, // if selected and needed
    };
    logger.debug(`User authenticated: ${user.email}, Role: ${user.role}`);
    next();
  } catch (error) {
    logger.error('Authentication error:', error);
    if (error instanceof jwt.TokenExpiredError) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Access token has expired'));
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Invalid access token'));
    }
    return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication failed'));
  }
};

/**
 * Middleware factory to authorize users based on their roles.
 * @param {...string} allowedRoles - Roles allowed to access the route.
 */
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !req.user.role) {
      logger.warn('Attempt to authorize without authenticated user or role.');
      return next(new ApiError(httpStatus.UNAUTHORIZED, 'Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      logger.warn(`User ${req.user.email} with role ${req.user.role} attempted to access restricted route. Allowed: ${allowedRoles.join(', ')}`);
      return next(new ApiError(httpStatus.FORBIDDEN, 'You do not have permission to perform this action'));
    }
    logger.debug(`User ${req.user.email} authorized with role ${req.user.role} for roles: ${allowedRoles.join(', ')}`);
    next();
  };
};

// Example UserRole enum (align with Prisma schema if defined there)
// export enum UserRole {
//   ADMINISTRATOR = 'ADMINISTRATOR',
//   SALES_MANAGER = 'SALES_MANAGER',
//   SALES_REPRESENTATIVE = 'SALES_REPRESENTATIVE',
// }
