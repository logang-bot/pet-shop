import { NextFunction, Request, Response } from 'express';
import crypto from 'crypto';

import AppError from '../utils/appError';
import User from '../models/user';

import { createTokenAndSend } from '../middleware/createToken';
import { customRequest } from '../middleware/auth';

// Todos los controladores de esta clase solamente pueden ser usados desde la perspectiva del usuario

class AuthControllers {
  // Controlador para registrar un usuario
  async signup(req: Request, res: Response) {
    console.log(req.body);
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      ci: req.body.ci,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
      passwordChangedAt: req.body.passwordChangedAt,
      role: req.body.role,
    });

    createTokenAndSend(newUser, 201, req, res);
  }

  // Controlador para logear a un usuario
  async login(req: Request, res: Response, next: NextFunction) {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
      return next(
        new AppError('El email y el password no pueden estar vacios', 400)
      );
    }

    // 2) Check if the users exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password)))
      return next(new AppError('El email o el passoword son incorrectos', 401)); // 401 means unathorized

    // 3) If everything ok, send token to client
    createTokenAndSend(user, 200, req, res);
  }

  // Controlador para deslogear a un usuario
  async logout(req: Request, res: Response) {
    res.cookie('jwt', 'loggedout', {
      expires: new Date(Date.now() + 10 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ status: 'success' });
  }

  // [BETA] Controlador para permitir al usuario recordar su password mandando un correo de recuperacion
  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user)
      return next(
        new AppError(
          'El email proporcionado no existe en nuestros registros. Por favor proporcione un email valido',
          404
        )
      );

    // 2) Generate the random reset token
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email

    // const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
      // await sendEmail({
      //   email: user.email,
      //   subject: 'Your password reset token (valid for 10 min)',
      //   message,
      // });
      const resetURL = `${req.protocol}://${req.get(
        'host'
      )}/api/v1/users/resetPassword/${resetToken}`;
      // await new Email(user, resetURL).sendPasswordReset();

      res.status(200).json({
        status: 'success',
        message: 'Token enviado al email!',
        resetURL,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError(
          'Ha ocurrido un error al enviar el email. Intenta de nuevo mas tarde',
          500
        )
      );
    }
  }

  // Controlador para resetear el password
  async resetPassword(req: Request, res: Response, next: NextFunction) {
    // 1) Get user based on the token
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    // 2) If token has not expired, and the reis use, se the new password
    if (!user) {
      return next(new AppError('El token es invalido o ha expirado', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createTokenAndSend(user, 200, req, res);
  }

  // Controlador para actualizar el passwor de un usuario
  async updatePassword(req: customRequest, res: Response, next: NextFunction) {
    // 1) Get user from the collection
    const user = await User.findById(req.user.id).select('+password');
    // 2) Check if POSTed current password is correct
    if (
      !(await user.correctPassword(req.body.passwordCurrent, user.password))
    ) {
      return next(new AppError('Tu password actual es incorrecto', 401));
    }
    // 3) If so, update password
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    await user.save();
    // User.findByIdAndUpdate will NOT work as intended

    // 4) Log user in, send JWT
    createTokenAndSend(user, 200, req, res);
  }

  restricTo(...roles: string[]) {
    return async (req: customRequest, res: Response, next: NextFunction) => {
      if (!roles.includes(req.user.role)) {
        return next(
          new AppError('Usted no tiene permisos para realizar esta accion', 403)
        );
      }
      next();
    };
  }
}

export default AuthControllers;
