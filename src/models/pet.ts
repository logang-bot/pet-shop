import { Schema, model } from 'mongoose';

const petSchema = new Schema({
  name: {
    type: String,
    required: [true, 'Una mascota debe tener un nombre'],
  },
  kind: {
    type: String,
    required: [true, 'Es necesario especificar la especie de la mascota'],
  },
  breed: {
    type: String,
    // required: true,
  },
  sex: {
    type: String,
    required: [true, 'Es necesario especificar el sexo de la mascota'],
  },
  weight: {
    type: Number,
    // required: true,
  },
  age: {
    type: Number,
  },
  birthday: {
    type: Date,
    default: Date.now(),
  },
  lastHeat: {
    type: Date,
  },
  agresivity: {
    type: Number,
  },
  lastUpdated: {
    type: Date,
    default: Date.now(),
  },
  dateReg: {
    type: Date,
    default: Date.now(),
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'Client',
    required: [true, 'Una venta debe tener una referencia al cliente'],
  },
});

export default model('Pet', petSchema);
