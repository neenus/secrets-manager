import ErrorResponse from '@utils/errorResponse';
import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  statusCode?: number;
  code?: number;
  value?: string;
  errors?: { [key: string]: { message: string } };
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.log("err in errorHandler: ", err);
  let error: CustomError = { ...err };
  error.message = err.message;
  error.statusCode = err.statusCode;

  // Log to console for dev
  console.log(err.stack);

  // Mongoose bad ObjectId error - CastError
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

  // Mongoose duplicate key error - MongoError
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = err.errors ? Object.values(err.errors).map(val => val.message).join(', ') : 'Validation error';
    error = new ErrorResponse(message, 400);
  }

  // return error response
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

export default errorHandler;