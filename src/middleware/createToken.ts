import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { customRequest } from './auth';

export const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

export const createTokenAndSend = (
  user: any,
  statusCode: number,
  req: customRequest | Request,
  res: Response,
  mode: String = 'user'
) => {
  let token = '';
  if (mode === 'user') {
    token = signToken(user._id);

    const cookieOptions = {
      expires: new Date(
        Date.now() + +process.env.JWT_COOKIE_EXPIRES_IN! * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: false,
      // secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
    };

    console.log('about to send the cookie');

    res.cookie('jwt', token, cookieOptions);
  }

  // Remove password from the output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token:
      token ||
      'El token no se creo, pues esta cuenta se creo desde el administrador',
    data: { user },
  });
};
