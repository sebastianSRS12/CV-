/**
 * Base application error class that extends the native Error class
 * Provides structured error handling with HTTP status codes and error codes
 */
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500, // HTTP status code for API responses
    public code?: string // Optional error code for client-side handling
  ) {
    super(message);
    this.name = 'AppError';
  }
}

/**
 * Validation error for form inputs and data validation
 * Used when user input doesn't meet requirements
 */
export class ValidationError extends AppError {
  constructor(message: string, public field?: string) {
    super(message, 400, 'VALIDATION_ERROR');
    this.name = 'ValidationError';
  }
}

/**
 * Authentication error for when user is not logged in
 * Returns 401 status code
 */
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, 'AUTHENTICATION_ERROR');
    this.name = 'AuthenticationError';
  }
}

/**
 * Authorization error for when user lacks permissions
 * Returns 403 status code
 */
export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, 'AUTHORIZATION_ERROR');
    this.name = 'AuthorizationError';
  }
}

/**
 * Not found error for missing resources
 * Returns 404 status code
 */
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERROR');
    this.name = 'NotFoundError';
  }
}

/**
 * Centralized error handler for API responses
 * Converts various error types into consistent API response format
 * @param error - The error to handle (can be any type)
 * @returns Structured error response object
 */
export function handleApiError(error: unknown) {
  // Handle our custom AppError instances
  if (error instanceof AppError) {
    return {
      error: error.message,
      code: error.code,
      statusCode: error.statusCode,
    };
  }

  // Handle standard JavaScript errors
  if (error instanceof Error) {
    return {
      error: error.message,
      code: 'INTERNAL_ERROR',
      statusCode: 500,
    };
  }

  // Handle unknown error types
  return {
    error: 'An unexpected error occurred',
    code: 'UNKNOWN_ERROR',
    statusCode: 500,
  };
}
