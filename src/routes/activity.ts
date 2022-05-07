import { Router } from 'express';
import { activityControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';

const router = Router();

router
  .route('/')
  .get(catchAsync(activityControllers.getAll))
  .post(catchAsync(activityControllers.createOne));

router
  .route('/:id')
  .get(catchAsync(activityControllers.getOne()))
  .patch(catchAsync(activityControllers.updateOne))
  .delete(catchAsync(activityControllers.deleteOne));

export default router;
