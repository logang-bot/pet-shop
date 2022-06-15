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

  // Mostrar medicines por mascota
  async showMedicinesByPet(req: Request, res: Response, next: NextFunction) {
    const idPet = req.params.idPet;
    const result2 = await Visit.find({ pet: idPet });

    const result = await Visit.aggregate([
      {
        $match: { pet: new mongoose.Types.ObjectId(idPet) },
      },
      {
        $group: {
          _id: '$pet',
          medicines: { $push: '$medicines' },
        },
      },
    ]);

    result[0].medicines = result[0].medicines.flat();

    res.status(200).json({ status: 'success', data: result });
  }

  // Mostrar especies mas atendidas [BETA]
  async showMostAttendantKind(req: Request, res: Response, next: NextFunction) {
    const result = await Pet.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: 'Visit',
          localField: 'pet',
          foreignField: '_id',
          as: 'visits',
        },
      },
    ]);

    res.status(200).json({ status: 'success', data: result });
  }
}

export default VisitControllers;
