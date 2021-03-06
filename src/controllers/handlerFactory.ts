import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';

import { Activity } from '../models';

import AppError from '../utils/appError';
import APIFeatures, { IQueryParameters } from '../utils/apiFeatures';
import { customRequest } from '../middleware/auth';

class handlerFactory {
  model: Model<any>;

  constructor(model: Model<any>) {
    this.model = model;
  }

  deleteOne = async (req: customRequest, res: Response, next: NextFunction) => {
    console.log('DELETING:', req.params.id);
    const doc = await this.model.findByIdAndDelete(req.params.id);

    console.log(doc);

    if (!doc)
      return next(
        new AppError('No se encontro ningun documento con ese ID', 404)
      );

    await Activity.create({
      operation: 'DELETE',
      user: req.user.id,
      model: this.model.modelName,
      activityDate: Date.now(),
    });
    res.status(204).json({ status: 'success', data: null });
  };

  updateOne = async (req: customRequest, res: Response, next: NextFunction) => {
    const doc = await this.model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc)
      return next(
        new AppError('No se encontro ningun documento con ese ID', 404)
      );

    await Activity.create({
      operation: 'UPDATE',
      user: req.user.id,
      model: this.model.modelName,
      activityDate: Date.now(),
    });
    res.status(200).json({ status: 'success', data: { data: doc } });
  };

  createOne = async (req: customRequest, res: Response, next: NextFunction) => {
    // const newDocument = new Model({})
    // newDocument.save()
    this.model.syncIndexes();
    const doc = await this.model.create(req.body);

    await Activity.create({
      operation: 'CREATE',
      user: req.user.id,
      model: this.model.modelName,
      activityDate: Date.now(),
    });
    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  };

  getOne = (...popOptions: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      let query = await this.model.findById(req.params.id);
      if (popOptions) query = query.populate(popOptions);
      const doc = await query;

      // const doc = await this.model.findById(req.params.id).populate('reviews');

      if (!doc)
        return next(
          new AppError('No se encontro ningun documento con ese ID', 404)
        );

      res.status(200).json({
        status: 'success',
        data: {
          data: doc,
        },
      });
    };
  };

  getAll = (...popOptions: any) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      console.log(this);
      this.model.syncIndexes();

      let filter = {};
      if (req.params.tourId) filter = { tour: req.params.tourId };

      // EXECUTE QUERY
      const features = new APIFeatures(
        this.model.find(filter),
        req.query as IQueryParameters
      )
        .filter()
        .sort()
        .limitFields()
        .paginate();

      // const doc = await features.query.explain();

      let doc;

      if (popOptions) doc = await features.query.populate(popOptions);
      else doc = await features.query;
      // const query =  Model.find()
      //   .where('duration')
      //   .equals(5)
      //   .where('difficulty')
      //   .equals('easy');

      // SEND RESPONSE
      return res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
          data: doc,
        },
      });
    };
  };
}

export default handlerFactory;
