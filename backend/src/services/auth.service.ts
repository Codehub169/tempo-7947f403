import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import httpStatus from 'http-status-codes';
import { prismaClient } from '../config/db';
import { config } from '../config';
import ApiError from '../utils/ApiError';
import { logger } from '../config/logger';
import { User, TokenType } from '@prisma/client'; // Assuming Prisma generates these types
import { v4 as uuidv4 } from 'uuid';
import { addMinutes } from 'date-fns'; // For token expiry calculation

export interface IUserWithTokens extends User {
  tokens: {
    access: { token: string; expires: Date };
    refresh?: { token: string; expires: Date }; // Refresh token is optional
  };
}

export interface ITokenPayload {
  sub: string; // Subject (user ID)
  iat: number; // Issued at
  exp: number; // Expiration time
  type: string; // Token type (e.g., ACCESS, REFRESH)
  role: string; // User role
}

/**
 * Create a user
 * @param {object} userData - User data
 * @returns {Promise<User>}
 */
export const registerUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'emailVerified'>): Promise<User> => {
  if (await prismaClient.user.findUnique({ where: { email: userData.email } })) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
  }
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  const userToCreate = {
    ...userData,
    password: hashedPassword,
  };
  // Ensure role is one of the accepted values if your schema has an enum
  // e.g., if (!Object.values(UserRole).includes(userData.role as UserRole)) throw new ApiError(...)
  const user = await prismaClient.user.create({
    data: userToCreate,
  });
  logger.info(`User registered: ${user.email}`);
  return user;
};

/**
 * Login with username and password
 * @param {string} email
 * @param {string} password
 * @returns {Promise<User>}
 */
export const loginUserWithEmailAndPassword = async (email: string, password: string): Promise<User> => {
  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  const isPasswordMatch = await bcrypt.compare(password, user.password);
  if (!isPasswordMatch) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
  }
  logger.info(`User login attempt successful: ${email}`);
  return user;
};

/**
 * Generate token
 * @param {string} userId
 * @param {Date} expires
 * @param {string} type
 * @param {string} [secret]
 * @returns {string}
 */
const generateToken = (userId: string, userRole: string, expires: Date, type: TokenType, secret: string = config.jwt.secret): string => {
  const payload: ITokenPayload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(expires.getTime() / 1000),
    type,
    role: userRole,
  };
  return jwt.sign(payload, secret);
};

/**
 * Save a token
 * @param {string} token
 * @param {string} userId
 * @param {Date} expires
 * @param {string} type
 * @param {boolean} [blacklisted]
 * @returns {Promise<void>}
 */
const saveToken = async (token: string, userId: string, expires: Date, type: TokenType, blacklisted = false): Promise<void> => {
  await prismaClient.token.create({
    data: {
      token,
      userId,
      expires,
      type,
      blacklisted,
    },
  });
  logger.debug(`Token saved for user ${userId}, type ${type}`);
};

/**
 * Verify token and return token doc (or throw an error if it is not valid)
 * @param {string} token
 * @param {string} type
 * @returns {Promise<Token>}
 */
export const verifyToken = async (token: string, type: TokenType): Promise<any> => {
  // First, verify JWT structure and signature
  let payload: ITokenPayload;
  try {
    payload = jwt.verify(token, type === TokenType.REFRESH ? config.jwt.refreshSecret : config.jwt.secret) as ITokenPayload;
  } catch (error) {
    logger.warn(`JWT verification failed for token type ${type}: ${error instanceof Error ? error.message : 'Unknown JWT error'}`);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token verification failed: Invalid signature or structure');
  }

  // Then, check against the database
  const tokenDoc = await prismaClient.token.findFirst({
    where: { token, type, userId: payload.sub, blacklisted: false },
  });

  if (!tokenDoc) {
    logger.warn(`Token not found in DB or blacklisted: type ${type}, user ${payload.sub}`);
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Token not found or invalid');
  }
  return tokenDoc;
};

/**
 * Generate auth tokens
 * @param {User} user
 * @returns {Promise<object>}
 */
export const generateAuthTokens = async (user: User): Promise<{ access: { token: string; expires: Date }, refresh: { token: string; expires: Date } }> => {
  const accessTokenExpires = addMinutes(new Date(), config.jwt.accessExpirationMinutes);
  const accessToken = generateToken(user.id, user.role, accessTokenExpires, TokenType.ACCESS);
  await saveToken(accessToken, user.id, accessTokenExpires, TokenType.ACCESS);

  const refreshTokenExpires = addMinutes(new Date(), config.jwt.refreshExpirationMinutes);
  const refreshToken = generateToken(user.id, user.role, refreshTokenExpires, TokenType.REFRESH, config.jwt.refreshSecret);
  await saveToken(refreshToken, user.id, refreshTokenExpires, TokenType.REFRESH);
  
  logger.info(`Auth tokens generated for user: ${user.email}`);
  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires,
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires,
    },
  };
};

/**
 * Generate reset password token
 * @param {string} email
 * @returns {Promise<string>}
 */
export const generateResetPasswordToken = async (email: string): Promise<string> => {
  const user = await prismaClient.user.findUnique({ where: { email } });
  if (!user) {
    // To prevent user enumeration, we don't throw an error here but log it.
    // The controller should send a generic success message.
    logger.warn(`Password reset requested for non-existent user: ${email}`);
    // Depending on strategy, you might return a dummy token or handle differently.
    // For now, let's throw an error that controller can catch and mask.
    throw new ApiError(httpStatus.NOT_FOUND, 'User with this email does not exist.');
  }
  const expires = addMinutes(new Date(), config.jwt.resetPasswordExpirationMinutes);
  const resetPasswordToken = uuidv4(); // Using UUID for simplicity, could be more secure
  await saveToken(resetPasswordToken, user.id, expires, TokenType.RESET_PASSWORD);
  logger.info(`Password reset token generated for user: ${email}`);
  return resetPasswordToken;
};

/**
 * Reset password
 * @param {string} resetPasswordToken
 * @param {string} newPassword
 * @returns {Promise<void>}
 */
export const resetPassword = async (resetPasswordToken: string, newPassword: string): Promise<void> => {
  try {
    const resetPasswordTokenDoc = await verifyToken(resetPasswordToken, TokenType.RESET_PASSWORD);
    const user = await prismaClient.user.findUnique({ where: { id: resetPasswordTokenDoc.userId } });
    if (!user) {
      throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'User not found after token verification'); // Should not happen
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await prismaClient.user.update({
      where: { id: user.id },
      data: { password: hashedPassword },
    });
    // Invalidate all reset password tokens for this user after successful reset
    await prismaClient.token.deleteMany({ where: { userId: user.id, type: TokenType.RESET_PASSWORD } });
    logger.info(`Password reset successfully for user: ${user.email}`);
  } catch (error) {
    if (error instanceof ApiError && error.statusCode === httpStatus.UNAUTHORIZED) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Password reset token is invalid or has expired');
    }
    logger.error('Error during password reset:', error);
    throw error;
  }
};

/**
 * Logout user by blacklisting their refresh token (if provided and strategy requires it)
 * @param {string} refreshToken
 * @returns {Promise<void>}
 */
export const logoutUser = async (refreshToken: string): Promise<void> => {
    try {
        const refreshTokenDoc = await prismaClient.token.findFirst({
            where: { token: refreshToken, type: TokenType.REFRESH, blacklisted: false },
        });

        if (!refreshTokenDoc) {
            throw new ApiError(httpStatus.NOT_FOUND, 'Refresh token not found or already invalidated');
        }

        // Blacklist the refresh token
        await prismaClient.token.update({
            where: { id: refreshTokenDoc.id },
            data: { blacklisted: true },
        });

        // Optionally, blacklist associated access tokens if needed, though they are short-lived
        // await prismaClient.token.updateMany({
        //     where: { userId: refreshTokenDoc.userId, type: TokenType.ACCESS, blacklisted: false },
        //     data: { blacklisted: true },
        // });

        logger.info(`User ${refreshTokenDoc.userId} logged out. Refresh token blacklisted.`);
    } catch (error) {
        logger.error('Error during logout:', error);
        // Don't necessarily throw an error to the client if token was already invalid
        if (error instanceof ApiError && error.statusCode === httpStatus.NOT_FOUND) {
            return; // Or log a specific warning
        }
        throw error; // Rethrow other errors
    }
};
