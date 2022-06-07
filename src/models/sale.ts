import { Schema, model } from 'mongoose';
import { Product } from '.';

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

saleSchema.post('save', async function () {
  console.log('saving');
  const idProduct = String(this.product);

  const product = await Product.findById(idProduct);

  product.stock -= this.quantity;

  await product.save();
});

export default model('Sale', saleSchema);
