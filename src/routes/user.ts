import { Router } from 'express';

import { authControllers, userControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';
import auth from '../middleware/auth';

const router = Router();

router.post('/signup', catchAsync(authControllers.signup));
router.post('/login', catchAsync(authControllers.login));
router.get('/logout', catchAsync(authControllers.logout));
router.post('/forgotPassword', catchAsync(authControllers.forgotPassword));
router.patch(
  '/resetPassword/:token',
  catchAsync(authControllers.resetPassword)
);

// Esta ruta protegera todas las rutas en adelante
router.use(catchAsync(auth));

router.patch('/updateMyPassword', catchAsync(authControllers.updatePassword));

router.get(
  '/me',
  catchAsync(userControllers.getMe),
  catchAsync(userControllers.getOne())
);

router.patch(
  '/updateMe',
  userControllers.uploadUserPhoto,
  catchAsync(userControllers.resizeUserPhoto),
  catchAsync(userControllers.updateMe)
);

router.delete('/deleteMe', catchAsync(userControllers.deleteMe));

// Esta ruta restringira el uso solo para administradores para las rutas en adelante
router.use(catchAsync(authControllers.restricTo('admin')));

router
  .route('/')
  .get(catchAsync(userControllers.getAll))
  .post(catchAsync(userControllers.createUser));

router
  .route('/:id')
  .get(catchAsync(userControllers.getOne()))
  .patch(catchAsync(userControllers.updateOne))
  .delete(catchAsync(userControllers.deleteOne));

export default router;
