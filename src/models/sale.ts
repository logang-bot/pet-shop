import { Schema, model } from 'mongoose';

const saleSchema = new Schema({
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
    type: [Schema.Types.ObjectId],
    ref: 'Product',
    validate: {
      message:
        'Una venta debe tener una referencia a la menos un producto vendido',
      validator: function (el: any[]) {
        return el.length > 0;
      },
    },
  },
  client: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
  },
});

export default model('Sale', saleSchema);
