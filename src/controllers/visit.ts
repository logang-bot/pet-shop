import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import factory from './handlerFactory';
import { Visit, Pet } from '../models';

class VisitControllers extends factory {
  // Mostrar visitas por cliente
  showVisitsPerClient = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const result = Visit.modelName;
    res.status(200).json({ status: 'success', data: result });
  };

  // Mostrar visitas por paciente
  async showVisitsPerPet(req: Request, res: Response, next: NextFunction) {
    const result = await Visit.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: '$pet',
          numVisits: { $sum: 1 },
        },
      },
    ]);

    const finalResult = await Promise.all(
      result.map(async (item) => ({
        ...item,
        _id: await Pet.findById(item._id),
      }))
    );

    res.status(200).json({ status: 'success', data: { finalResult } });
  }
}

export default VisitControllers;
