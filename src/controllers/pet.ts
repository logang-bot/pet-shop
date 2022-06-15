import { Request, Response, NextFunction } from 'express';

import factory from './handlerFactory';
import { Pet, Client } from '../models';

class PetControllers extends factory {
  //mostrar pacientes por cliente
  async showPetsByClient(req: Request, res: Response, next: NextFunction) {
    const result = await Pet.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: '$owner',
          numPets: { $sum: 1 },
        },
      },
    ]);

    const finalResult = await Promise.all(
      result.map(async (item) => ({
        ...item,
        _id: await Client.findById(item._id),
      }))
    );

    res.status(200).json({ status: 'success', data: { finalResult } });
  }
}

export default PetControllers;
