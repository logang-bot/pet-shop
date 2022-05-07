import { Schema, model } from 'mongoose';

const clientSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'El nombre es un campo requerido'],
    },
    ci: {
      type: String,
      required: [true, 'El Ci es necesario'],
      unique: true,
    },
    phoneNumber: {
      type: Number,
    },
    address: {
      type: String,
    },
    dateReg: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    timestamps: true,
  }
);

export default model('Client', clientSchema);
