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

const medicineSchema = new Schema({
  kind: {
    type: String,
  },
  brand: {
    type: String,
  },
  product: {
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
    medicines: [
      {
        type: medicineSchema,
        default: () => ({}),
      },
    ],
    prescription: [
      {
        type: medicineSchema,
        default: () => ({}),
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default model('Visit', visitSchema);
