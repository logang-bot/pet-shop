import { Router } from 'express';
import { petControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';

const router = Router();

router
  .route('/')
  .get(catchAsync(petControllers.getAll))
  .post(catchAsync(petControllers.createOne));

router
  .route('/:id')
  .get(catchAsync(petControllers.getOne()))
  .patch(catchAsync(petControllers.updateOne))
  .delete(catchAsync(petControllers.deleteOne));

export default router;
