import { Router } from 'express';

import { petControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';
import auth from '../middleware/auth';

const router = Router();

// Esta ruta protegera todas las rutas en adelante
router.use(catchAsync(auth));

router.get('/showPetsByClient', catchAsync(petControllers.showPetsByClient));

router
  .route('/')
  .get(
    catchAsync(
      petControllers.getAll({
        path: 'owner',
        select: '-dateReg -createdAt -updatedAt -__v',
      })
    )
  )
  .post(catchAsync(petControllers.createOne));

router
  .route('/:id')
  .get(
    catchAsync(
      petControllers.getOne({
        path: 'owner',
        select: '-dateReg -createdAt -updatedAt -__v',
      })
    )
  )
  .patch(catchAsync(petControllers.updateOne))
  .delete(catchAsync(petControllers.deleteOne));

export default router;
