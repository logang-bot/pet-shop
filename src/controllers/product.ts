import { Request, Response, NextFunction } from 'express';

import { Product, Sale } from '../models';
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
          products: { $push: '$name' },
          productsIds: { $push: '$_id' },
        },
      },
    ]);

    res.status(200).json({ status: 'success', data: { rawResult } });
  }
}

export default ProductControllers;
