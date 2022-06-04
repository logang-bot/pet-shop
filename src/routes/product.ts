import { Router } from 'express';

import { productControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';
import auth from '../middleware/auth';

const router = Router();

// Esta ruta protegera todas las rutas en adelante
router.use(catchAsync(auth));

router.get(
  '/mostDemandProductsCategory',
  productControllers.mostDemandProductsCategory
);

router
  .route('/')
  .get(catchAsync(productControllers.getAll()))
  .post(catchAsync(productControllers.createOne));

router
  .route('/:id')
  .get(catchAsync(productControllers.getOne()))
  .patch(catchAsync(productControllers.updateOne))
  .delete(catchAsync(productControllers.deleteOne));

export default router;
