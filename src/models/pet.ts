import { Schema, model } from 'mongoose';

const petSchema = new Schema(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

petSchema.virtual('visits', {
  ref: 'Visit',
  foreignField: 'pet',
  localField: '_id',
});

petSchema.virtual('esthetics', {
  ref: 'Esthetic',
  foreignField: 'pet',
  localField: '_id',
});

// petSchema.pre(/^find/, function (next) {
//   this.populate({
//     path: 'owner',
//     select: 'name',
//   });
//   next();
// });

export default model('Pet', petSchema);
