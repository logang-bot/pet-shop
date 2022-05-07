import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';

import User from '../models/user';
import AppError from '../utils/appError';

export interface customRequest extends Request {
  token: string;
  user: {
    [key: string]: string;
  };
}

const auth = async (req: customRequest, res: Response, next: NextFunction) => {
  // 1) Getting token and check if it's there
  console.log(req.cookies);
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization?.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.jwt) {
    token = req.cookies?.jwt;
  }
  // console.log(token);
  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  // 2) Verification token

  const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  // console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser)
    return next(
      new AppError('The user belonging to this token does no longer exist', 401)
    );

  // 4) Check if user changed password after the JWT token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  res.locals.user = currentUser;
  next();
};

export default auth;
