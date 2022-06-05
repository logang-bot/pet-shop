import { Router } from 'express';

import { clientControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';
import auth from '../middleware/auth';

const router = Router();

router
  .route('/')
  .get(catchAsync(clientControllers.getAll()))
  .post(catchAsync(clientControllers.createOne));

router
  .route('/:id')
  .get(
    catchAsync(clientControllers.getOne({ path: 'pets' }, { path: 'sales' }))
  )
  .patch(catchAsync(clientControllers.updateOne))
  .delete(catchAsync(clientControllers.deleteOne));

export default router;
