import { NextFunction, Request, Response } from 'express';
import multer, { FileFilterCallback, Multer } from 'multer';
import sharp from 'sharp';
import path from 'path';

import { User } from '../models';
import { customRequest } from '../middleware/auth';
import { createTokenAndSend } from '../middleware/createToken';

import AppError from '../utils/appError';
import factory from './handlerFactory';

const multerStorage = multer.memoryStorage();

const multerFilter = (req: Request, file: any, cb: FileFilterCallback) => {
  if (file.mimetype.startsWith('image')) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        'El archivo no es una imagen, Solo puede subir imagenes',
        400
      )
    );
  }
};

const upload: Multer = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

class UserControllers extends factory {
  // Los siguientes controladores solamente pueden ser usados desde la perspectiva del usuario
  async getMe(req: customRequest, res: Response, next: NextFunction) {
    req.params.id = req.user.id;
    next();
  }

  async updateMe(req: customRequest, res: Response, next: NextFunction) {
    const filterObj = (
      obj: { [key: string]: string },
      ...allowedFields: string[]
    ) => {
      const newObj: { [key: string]: string } = {};
      Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
      });
      return newObj;
    };
    // 1) Create errror if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
      return next(
        new AppError(
          'Esta ruta no es para actualizacion de password. Por favor use /updateMyPaassword',
          400
        )
      );
    }
    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email', 'ci');
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  }

  async deleteMe(req: customRequest, res: Response, next: NextFunction) {
    await User.findByIdAndUpdate(req.user.id, { active: false });
    res.status(204).json({
      status: 'success',
      data: null,
    });
  }

  get uploadUserPhoto() {
    return upload.single('photo');
  }

  async resizeUserPhoto(req: customRequest, res: Response, next: NextFunction) {
    if (!req.file) return next();

    req.file.filename = `user-${req.user.id}-${Date.now()}.jpeg`;

    await sharp(req.file.buffer)
      .resize(500, 500)
      .toFormat('jpeg')
      .jpeg({ quality: 90 })
      .toFile(
        path.join(__dirname, `../../public/img/users/${req.file.filename}`)
      );
    // .toFile(`public/img/users/${req.file.filename}`);

    next();
  }

  // Los siguientes controladores solo son admisibles para el administrador
  async createUser(req: Request, res: Response) {
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

    createTokenAndSend(newUser, 201, req, res, 'admin');
  }

  updateOne = async (req: Request, res: Response, next: NextFunction) => {
    const filterObj = (
      obj: { [key: string]: string },
      ...allowedFields: string[]
    ) => {
      const newObj: { [key: string]: string } = {};
      Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el)) newObj[el] = obj[el];
      });
      return newObj;
    };
    // 1) Create errror if user POSTs password data
    // if (req.body.password || req.body.passwordConfirm) {
    //   return next(
    //     new AppError(
    //       'Esta ruta no es para actualizacion de password. Por favor use /updateMyPaassword',
    //       400
    //     )
    //   );
    // }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'name', 'email', 'ci');
    if (req.file) filteredBody.photo = req.file.filename;

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    if (req.body.password) {
      updatedUser.password = req.body.password;
      updatedUser.passwordConfirm = req.body.passwordConfirm;

      await updatedUser.save();
    }

    res.status(200).json({
      status: 'success',
      data: {
        user: updatedUser,
      },
    });
  };
}

export default UserControllers;
