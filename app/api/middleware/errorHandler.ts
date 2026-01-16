import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

export const errorHandler = (
  err: Error | mongoose.Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((error) => error.message)
      .join(', ');
  }

  // Mongoose cast error (invalid ID)
  if (err instanceof mongoose.Error.CastError || err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid ID format';
  }

  // Duplicate key error
  if ((err as any).code === 11000) {
    statusCode = 400;
    message = 'Duplicate entry';
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid token';
  }

  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Token expired';
  }

  // Custom error message
  if (err.message && statusCode === 500) {
    message = err.message;
  }

  // Log 500 errors to console, but suppress client errors to avoid noise
  if (statusCode === 500) {
    console.error('SERVER ERROR:', err);
  } else {
    console.warn(`CLIENT ERROR (${statusCode}): ${message}`);
  }

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && statusCode === 500 && { stack: err.stack }),
  });
};

