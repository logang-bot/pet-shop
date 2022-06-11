import { NextFunction, Request, Response } from 'express';
import { CastError } from 'mongoose';
import AppError from '../utils/appError';

interface IError {
  errors: {};
  _message: string;
  statusCode: number;
  status: string;
  name: string;
  message: string;
}

interface IJsonError {
  [error: string]: string;
}

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(err);

  const message = `El ${
    Object.keys(err.keyValue)[0]
  } proporcionado ya existe en otra cuenta: ${value}. Por favor usa otro`;
  return new AppError(message, 400);
};

const handleCastErrorDB = (err: CastError) => {
  console.log('casting failed');
  const message = `Invalid ${err.path}: is ${err.value}`;
  return new AppError(message, 400);
};

const handleValidationErrorDb = (err: IError) => {
  const totalError: IJsonError = {};
  console.log(err);

  Object.values(err.errors).forEach((el: any) => {
    totalError[el.path] = el.message;
  });

  const message = totalError || 'randomError';
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Token invalido, por favor vuelve a logearte al sistema', 401);

const handleJWTExpiredError = () =>
  new AppError(
    'Tu token a expirado, por favor vuelve a logeart al sistema',
    401
  );

const sendErrorDev = (err: any, req: Request, res: Response) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }
  return res.status(400).json({
    status: 'error',
    message: err.message,
  });
};

const sendErrorProd = (err: any, req: Request, res: Response) => {
  // A) API
  // if (req.originalUrl.startsWith('/api')) {
  // A) Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      // tojson: JSON.parse(err.message),
      status: err.status,
      message: err.message,
    });
  }
  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR :'v", err);
  // 2) Send generic message
  return res.status(500).json({
    status: 'error',
    message: 'Algo salio mal',
  });
  // }

  // B) Programming or other unknown error: don't leak error details
  // 1) Log error
  console.error("ERROR :'v", err);
};

export default (err: any, req: Request, res: Response, next: NextFunction) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err }; CAUSES BUGS
    console.log('errooooooooooooooooooor');
    let error = Object.assign(err);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === 'CastError') error = handleCastErrorDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDb(error);
    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, req, res);
  }
};
