import { Router } from 'express';

import { visitControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';
import auth from '../middleware/auth';

const router = Router();

// Esta ruta protegera todas las rutas en adelante
router.use(catchAsync(auth));

router
  .route('/visitPerClient')
  .get(catchAsync(visitControllers.showVisitsPerClient));

router.route('/visitPerPet').get(catchAsync(visitControllers.showVisitsPerPet));

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
