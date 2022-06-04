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

    // const rawProductResult = await Promise.all(
    //   rawResult.map(async (item) => {
    //     const prd = await Product.findById(item._id);

    //     return {
    //       ...item,
    //       category: prd.category,
    //     };
    //   })
    // );

    // let finalResult: any;

    // rawProductResult.forEach((item) => {
    //   let aux: {
    //     [key: string]: any;
    //   } = {};
    //   for (const [key, value] of Object.entries(item)) {
    //     aux[key] = aux[key] + value;
    //   }
    //   finalResult.push(aux);
    // });

    res.status(200).json({ status: 'success', data: { rawResult } });
  }
}

export default ProductControllers;
