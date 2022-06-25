import { Router } from 'express';

import { stockControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';
import auth from '../middleware/auth';

const router = Router();

// Esta ruta protegera todas las rutas en adelante
router.use(catchAsync(auth));

router
  .route('/')
  .get(catchAsync(stockControllers.getAll({ path: 'product' })))
  .post(catchAsync(stockControllers.createOne));

router
  .route('/:id')
  .get(catchAsync(stockControllers.getOne({ path: 'product' })))
  .patch(catchAsync(stockControllers.updateOne))
  .delete(catchAsync(stockControllers.deleteOne));

export default router;
