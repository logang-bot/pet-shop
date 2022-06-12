import { Schema, model } from 'mongoose';
import { Product } from '.';

const saleSchema = new Schema(
  {
    quantityItems: {
      type: Number,
      min: 1,
      required: [true, 'Debe proporcionar una cantidad de items valida'],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    saleDate: {
      type: Date,
      default: Date.now(),
    },
    product: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'Una venta debe tener una referencia a un producto'],
        },
        quantity: {
          type: Number,
          required: [true, 'La cantidad de items vendidos es requerido'],
        },
      },
    ],
    client: {
      type: Schema.Types.ObjectId,
      ref: 'Client',
      required: [true, 'Es necesario especificar un cliente'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

saleSchema.pre('save', async function (next) {
  const products = this.product;

  products.forEach(async (productRaw: any) => {
    const product = await Product.findById(String(productRaw.productId));

    product.stock -= productRaw.quantity;
    product.unitsSold += productRaw.quantity;

    await product.save();
  });

  next();
});

export default model('Sale', saleSchema);
