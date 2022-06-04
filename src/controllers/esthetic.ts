import { Request, Response, NextFunction } from 'express';

import factory from './handlerFactory';
import { Esthetic, Pet } from '../models';

class EstheticControllers extends factory {
  // Mostrar esteticas por paciente
  async showEstheticPerPet(req: Request, res: Response, next: NextFunction) {
    const result = await Esthetic.aggregate([
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

export default EstheticControllers;
