import { Router } from 'express';
import { productControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';

const router = Router();

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
