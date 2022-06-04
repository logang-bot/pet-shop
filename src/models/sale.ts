import { Schema, model } from 'mongoose';

const saleSchema = new Schema(
  {
    quantity: {
      type: Number,
      min: 0,
      required: [true, 'Debe proporcionar una cantidad valida'],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    saleDate: {
      type: Date,
      default: Date.now(),
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Una venta debe tener una refenrecia a un producto'],
    },
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

export default model('Sale', saleSchema);
