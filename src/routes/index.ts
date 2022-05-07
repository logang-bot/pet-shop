import { Router } from 'express';
import userRoutes from './user';
import activityRoutes from './activity';
import clientRoutes from './client';
import estheticRoutes from './esthetic';
import petRoutes from './pet';
import productRoutes from './product';
import saleRoutes from './sale';
import visitRoutes from './visit';

const router = Router();

router.use('/user', userRoutes);
router.use('/activity', activityRoutes);
router.use('/client', clientRoutes);
router.use('/esthetic', estheticRoutes);
router.use('/pet', petRoutes);
router.use('/product', productRoutes);
router.use('/sale', saleRoutes);
router.use('/visit', visitRoutes);

export default router;
