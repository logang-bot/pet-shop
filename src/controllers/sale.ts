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

  // Productos mas vendidos
  async mostDemandProducts(req: Request, res: Response, next: NextFunction) {
    const rawResult = await Sale.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: '$product',
          numItemsSold: { $sum: '$quantity' },
        },
      },
    ]);

    const finalResult = await Promise.all(
      rawResult.map(async (item) => ({
        ...item,
        _id: await Product.findById(item._id),
      }))
    );

    res.status(200).json({ status: 'success', data: { finalResult } });
  }

  // Categoria de productos mas vendidos
  async mostDemandProductsCategory(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const rawSaleResult = await Sale.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: '$product',
          numItemsSold: { $sum: '$quantity' },
        },
      },
      {
        $project: {
          _id: {
            $toString: '$_id',
          },
          numItemsSold: 1,
        },
      },
    ]);

    interface productRes {
      [k: string]: any;
    }

    const rawProductResult: productRes[] = await Product.aggregate([
      {
        $match: {},
      },
      {
        $group: {
          _id: '$category',
          productsIds: { $push: { $toString: '$_id' } },
        },
      },
    ]);

    rawProductResult.forEach((item) => {
      let aux = rawSaleResult.length;
      item.products = [];
      item.totalItems = 0;
      while (aux--) {
        if (item.productsIds.includes(rawSaleResult[aux]._id)) {
          item.products.push(rawSaleResult[aux]);
          item.totalItems += rawSaleResult[aux].numItemsSold;
          rawSaleResult.splice(aux, 1);
        }
      }
      delete item.productsIds;
      delete item.products;
    });

    res.status(200).json({ status: 'success', data: rawProductResult });
  }
}

export default SaleControllers;
