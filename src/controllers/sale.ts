import { Request, Response, NextFunction } from 'express';

import factory from './handlerFactory';
import { Sale, Product, Client } from '../models';
class SaleControllers extends factory {
  // Mostrar ventas por cliente
  async showSalesByClient(req: Request, res: Response, next: NextFunction) {
    const result = await Sale.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: '$client',
          numProductsSold: { $sum: '$quantity' },
          numSales: { $sum: 1 },
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

export default SaleControllers;
