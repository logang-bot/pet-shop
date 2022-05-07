import { Schema, model } from 'mongoose';

const paramVisitSchema = new Schema({
  weight: {
    type: String,
  },
  temperature: {
    type: Number,
  },
  heartbeat: {
    type: Number,
  },
  heartRate: {
    type: Number,
  },
  breathingFrequency: {
    type: Number,
  },
  abdominalPalpation: {
    type: String,
  },
});

const antiparasiticSchema = new Schema({
  kind: {
    type: String,
  },
  brand: {
    type: String,
  },
});

const vaccineSchema = new Schema({
  // tipo
  kind: {
    type: String,
  },
  // marca
  brand: {
    type: String,
  },
});

const visitSchema = new Schema(
  {
    pet: {
      type: Schema.Types.ObjectId,
      ref: 'Pet',
      required: [
        true,
        'Una visita debe tener una referencia a la mascota examinada',
      ],
    },
    fechaReg: {
      type: Date,
      default: Date.now(),
    },
    reason: {
      type: String,
    },
    diagnosis: {
      type: String,
    },
    treatment: {
      type: String,
    },
    price: {
      type: Number,
    },
    visitParams: {
      type: paramVisitSchema,
      default: () => ({}),
    },
    antiparasitic: {
      type: antiparasiticSchema,
      default: () => ({}),
    },
    vaccines: [
      {
        type: vaccineSchema,
        default: () => ({}),
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model('Visit', visitSchema);
