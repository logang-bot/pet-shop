import { Router } from 'express';
import { visitControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';

const router = Router();

router
  .route('/')
  .get(catchAsync(visitControllers.getAll({ path: 'pet' })))
  .post(catchAsync(visitControllers.createOne));

router
  .route('/:id')
  .get(catchAsync(visitControllers.getOne({ path: 'pet' })))
  .patch(catchAsync(visitControllers.updateOne))
  .delete(catchAsync(visitControllers.deleteOne));

export default router;
