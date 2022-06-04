import { Router } from 'express';

import { estheticControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';
import auth from '../middleware/auth';

const router = Router();

// Esta ruta protegera todas las rutas en adelante
router.use(catchAsync(auth));

router
  .route('/')
  .get(catchAsync(estheticControllers.getAll({ path: 'pet' })))
  .post(catchAsync(estheticControllers.createOne));

router
  .route('/:id')
  .get(catchAsync(estheticControllers.getOne({ path: 'pet' })))
  .patch(catchAsync(estheticControllers.updateOne))
  .delete(catchAsync(estheticControllers.deleteOne));

export default router;
