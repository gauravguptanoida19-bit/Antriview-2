import { Request, Response, NextFunction } from 'express';
import { config } from '../config/env.js';

export interface AppError extends Error {
  statusCode?: number;
  code?: number;
  errors?: any;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Mongoose CastError (Bad ObjectId)
  if (err.name === 'CastError') {
    message = 'Resource not found with specified identifier';
    statusCode = 404;
  }

  // Handle Mongoose duplicate key error (E11000)
  if (err.code === 11000) {
    message = 'An account or record with this unique field already exists';
    statusCode = 400;
  }

  // Handle Mongoose ValidationError
  if (err.name === 'ValidationError' && err.errors) {
    const errorDetails = Object.values(err.errors).map((val: any) => val.message);
    message = errorDetails.join(', ');
    statusCode = 400;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    message = 'Invalid authentication token';
    statusCode = 401;
  }

  if (err.name === 'TokenExpiredError') {
    message = 'Authentication token expired';
    statusCode = 401;
  }

  // Log error in development
  if (config.NODE_ENV === 'development') {
    console.error(`❌ [API Error] ${req.method} ${req.originalUrl}:`, err);
  }

  res.status(statusCode).json({
    success: false,
    message,
    stack: config.IS_PRODUCTION ? undefined : err.stack,
  });
};
