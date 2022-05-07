import { Router } from 'express';
import { visitControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';

const router = Router();

router
  .route('/')
  .get(catchAsync(visitControllers.getAll))
  .post(catchAsync(visitControllers.createOne));

router
  .route('/:id')
  .get(catchAsync(visitControllers.getOne()))
  .patch(catchAsync(visitControllers.updateOne))
  .delete(catchAsync(visitControllers.deleteOne));

export default router;
