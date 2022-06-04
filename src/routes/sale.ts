import { Router } from 'express';

import { saleControllers } from '../controllers';
import catchAsync from '../utils/catchAsync';
import auth from '../middleware/auth';

const router = Router();

// Esta ruta protegera todas las rutas en adelante
router.use(catchAsync(auth));

// Mostrar ventas por cliente

router
  .route('/showSalesByClient')
  .get(catchAsync(saleControllers.showSalesByClient));

router
  .route('/mostDemandProductsCategory')
  .get(catchAsync(saleControllers.mostDemandProductsCategory));

router
  .route('/mostDemandProducts')
  .get(catchAsync(saleControllers.mostDemandProducts));

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
