import { Schema, model } from 'mongoose';
import { Product } from '.';

const stockSchema = new Schema({
  quantityEntered: {
    type: Number,
    required: [true, 'La cantidad ingresada es necesaria'],
    min: 0,
  },
  enterDate: {
    type: String,
    default: Date.now(),
  },
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: [true, 'Es necesario especificar el producto'],
  },
  totalPrice: {
    type: Number,
    required: [true, 'El precio total debe ser especificado'],
    min: 0,
  },
});

stockSchema.pre('save', async function (next) {
  const product = await Product.findById(this.product);
  console.log(product);

  product.stock += this.quantityEntered;

  await product.save();

  next();
});

export default model('Stock', stockSchema);
