import { Router } from 'express';
import { saleControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';

const router = Router();

router
  .route('/')
  .get(
    catchAsync(saleControllers.getAll({ path: 'product' }, { path: 'client' }))
  )
  .post(catchAsync(saleControllers.createOne));

router
  .route('/:id')
  .get(
    catchAsync(saleControllers.getOne({ path: 'product' }, { path: 'client' }))
  )
  .patch(catchAsync(saleControllers.updateOne))
  .delete(catchAsync(saleControllers.deleteOne));

export default router;
