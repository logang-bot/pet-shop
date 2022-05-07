import { Schema, model } from 'mongoose';

const saleSchema = new Schema({
  quantity: {
    type: Number,
    required: [true, 'Please provide a valid quantity'],
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
    required: [true, 'Una venta debe tener una referencia al producto vendido'],
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Una venta debe tener una referencia al cliente'],
  },
});

export default model('Sale', saleSchema);
