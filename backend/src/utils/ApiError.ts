import httpStatus from 'http-status-codes';

interface ErrorDetail {
  field?: string;
  message: string;
  value?: any;
}

class ApiError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public errors?: ErrorDetail[];

  constructor(
    statusCode: number,
    message: string,
    isOperational = true,
    stack = '',
    errors?: ErrorDetail[]
  ) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  static badRequest(message = httpStatus.getStatusText(httpStatus.BAD_REQUEST), errors?: ErrorDetail[]) {
    return new ApiError(httpStatus.BAD_REQUEST, message, true, undefined, errors);
  }

  static unauthorized(message = httpStatus.getStatusText(httpStatus.UNAUTHORIZED)) {
    return new ApiError(httpStatus.UNAUTHORIZED, message, true);
  }

  static forbidden(message = httpStatus.getStatusText(httpStatus.FORBIDDEN)) {
    return new ApiError(httpStatus.FORBIDDEN, message, true);
  }

  static notFound(message = httpStatus.getStatusText(httpStatus.NOT_FOUND)) {
    return new ApiError(httpStatus.NOT_FOUND, message, true);
  }

  static internal(message = httpStatus.getStatusText(httpStatus.INTERNAL_SERVER_ERROR), stack?: string) {
    return new ApiError(httpStatus.INTERNAL_SERVER_ERROR, message, false, stack);
  }
}

export default ApiError;
