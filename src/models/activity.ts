import { Schema, model } from 'mongoose';

const activitySchema = new Schema({
  accessDate: {
    type: Date,
    required: [true, 'Es necesaria la fecha de acceso del usuario'],
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Una actividad debe pertenecer a un usuario'],
  },
  operation: {
    type: String,
    enum: {
      values: ['Create', 'Delete', 'Update'],
      message: 'Las operacion permitidas son: Create, Delete, Update',
    },
  },
  model: {
    type: String,
  },
});

export default model('Activity', activitySchema);
