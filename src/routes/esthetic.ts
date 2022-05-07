import { Router } from 'express';
import { estheticControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';

const router = Router();

router
  .route('/')
  .get(catchAsync(estheticControllers.getAll))
  .post(catchAsync(estheticControllers.createOne));

router
  .route('/:id')
  .get(catchAsync(estheticControllers.getOne()))
  .patch(catchAsync(estheticControllers.updateOne))
  .delete(catchAsync(estheticControllers.deleteOne));

export default router;
