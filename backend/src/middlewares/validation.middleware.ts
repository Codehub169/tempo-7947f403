import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import httpStatus from 'http-status-codes';
import ApiError from '../utils/ApiError';
import { logger } from '../config/logger';

/**
 * Middleware to validate request data using express-validator chains.
 * @param {ValidationChain[]} validations - An array of express-validator validation chains.
 * @returns {Function} Express middleware function.
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    // Run all validation chains in parallel
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    // Format errors for a more structured response
    const formattedErrors = errors.array().map(err => ({
      field: (err as any).path || (err as any).param || 'unknown_field',
      message: err.msg,
      value: (err as any).value, // Be cautious about logging sensitive values
    }));

    logger.warn('Validation failed:', { 
        url: req.originalUrl,
        method: req.method,
        errors: formattedErrors 
    });

    // For a user-facing API, you might want to simplify the error message
    // or just send the first error, or a generic message.
    // Here, we send all formatted errors.
    return next(new ApiError(
      httpStatus.BAD_REQUEST, 
      'Validation Error', 
      true, // isOperational
      undefined, // stack (ApiError handles this)
      formattedErrors // Pass structured errors as part of the ApiError payload
    ));
  };
};

/*
  Example usage in a route file:

  import { body } from 'express-validator';
  import { validate } from './validation.middleware';
  import { someControllerFunction } from './some.controller';

  router.post(
    '/some-route',
    validate([
      body('email').isEmail().withMessage('Must be a valid email'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    ]),
    someControllerFunction
  );
*/
