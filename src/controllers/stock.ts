import { Request, Response, NextFunction } from 'express';

import factory from './handlerFactory';
import { Stock } from '../models';

class StockControllers extends factory {}

export default StockControllers;
