import AuthControllers from './auth';
import UserControllers from './user';
import ActivityControllers from './activity';
import ClientControllers from './client';
import EstheticControllers from './esthetic';
import PetControllers from './pet';
import ProductControllers from './product';
import SaleControllers from './sale';
import VisitControllers from './visit';

import {
  Activity,
  Client,
  Esthetic,
  Pet,
  Product,
  Sale,
  User,
  Visit,
} from '../models';

export const authControllers = new AuthControllers();

export const activityControllers = new ActivityControllers(Activity);
export const clientControllers = new ClientControllers(Client);
export const estheticControllers = new EstheticControllers(Esthetic);
export const petControllers = new PetControllers(Pet);
export const productControllers = new ProductControllers(Product);
export const saleControllers = new SaleControllers(Sale);
export const userControllers = new UserControllers(User);
export const visitControllers = new VisitControllers(Visit);
