import { Request, Response, NextFunction } from 'express';

import { Product } from '../models';
import factory from './handlerFactory';

class ProductControllers extends factory {
  // Categoria de productos mas vendidos
  async mostDemandProductsCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const rawResult = await Product.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: '$category',
          numItemsSold: { $sum: '$unitsSold' },
        },
      },
    ]);

    res.status(200).json({ status: 'success', data: { rawResult } });
  }

  // Productos mas vendidos
  async mostSoldProducts(req: Request, res: Response, next: NextFunction) {
    const result = await Product.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: '$name',
          numItemsSold: { $sum: '$unitsSold' },
        },
      },
      {
        $sort: {
          numItemsSold: -1,
        },
      },
    ]);

    res.status(200).json({ status: 'success', data: { result } });
  }
}

export default ProductControllers;
