import { Router } from 'express';
import { clientControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';

const router = Router();

router
  .route('/')
  .get(catchAsync(clientControllers.getAll))
  .post(catchAsync(clientControllers.createOne));

router
  .route('/:id')
  .get(catchAsync(clientControllers.getOne()))
  .patch(catchAsync(clientControllers.updateOne))
  .delete(catchAsync(clientControllers.deleteOne));

export default router;
