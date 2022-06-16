import { Router } from 'express';
import { activityControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';

const router = Router();

router
  .route('/')
  .get(catchAsync(activityControllers.getAll({ path: 'user' })))
  .post(catchAsync(activityControllers.createOne));

router
  .route('/:id')
  .get(catchAsync(activityControllers.getOne({ path: 'user' })))
  .patch(catchAsync(activityControllers.updateOne))
  .delete(catchAsync(activityControllers.deleteOne));

export default router;
