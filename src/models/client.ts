import { Schema, model } from 'mongoose';
import { Pet, Visit, Esthetic } from '.';

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
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

clientSchema.virtual('pets', {
  ref: 'Pet',
  foreignField: 'owner',
  localField: '_id',
});

clientSchema.virtual('sales', {
  ref: 'Sale',
  foreignField: 'client',
  localField: '_id',
});

// clientSchema
//   .virtual('visits')
//   .get(function (this: { name: string; pets: []; _id: string }) {
//     const allPets = Pet.find({ owner: this._id }).then((pets) => {
//       return pets.map((item) => String(item._id));
//     });

//     const getAndFormatData = async () => {
//       const allPets = (await Pet.find({ owner: this._id })).map((item) =>
//         String(item._id)
//       );

//       const allVisits = await Visit.find({
//         pet: { $in: allPets },
//       });
//     };

//     console.log(Promise.resolve(allPets));

//     return 'data';
//   });

// clientSchema
//   .virtual('esthetics')
//   .get(async function (this: { name: string; pets: []; _id: string }) {
//     // const allPets = (await Pet.find({ owner: this._id })).map((item) =>
//     //   String(item._id)
//     // );

//     // const allVisits = await Visit.find({
//     //   pet: { $in: allPets },
//     // });

//     // console.log(allVisits);

//     return 'this.namfdsae';
//   });

export default model('Client', clientSchema);
