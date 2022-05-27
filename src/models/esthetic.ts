import { Schema, model } from 'mongoose';

const estheticSchema = new Schema({
  pet: {
    type: Schema.Types.ObjectId,
    ref: 'Pet',
    required: [
      true,
      'La atencion de estetica debe tener una referencia a la mascota',
    ],
  },
  kind: {
    type: String,
  },
  price: {
    type: Number,
  },
  photoBefore: {
    type: String,
  },
  photoAfter: {
    type: String,
  },
  dateReg: {
    type: Date,
    default: Date.now(),
  },
  detail: {
    type: String,
    default: 'No details',
  },
});

export default model('Esthetic', estheticSchema);
