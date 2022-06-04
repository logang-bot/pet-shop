import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import factory from './handlerFactory';
import { Visit } from '../models';

class VisitControllers extends factory {
  visitPerClient = async (req: Request, res: Response, next: NextFunction) => {
    const result = Visit.modelName;
    res.status(200).json({ status: 'success', data: result });
  };
}

export default VisitControllers;
