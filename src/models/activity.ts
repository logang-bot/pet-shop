import { Schema, model } from 'mongoose';

const activitySchema = new Schema({
  activityDate: {
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
      values: ['CREATE', 'DELETE', 'UPDATE'],
      message: 'Las operacion permitidas son: CREATE, DELETE, UPDATE',
    },
  },
  model: {
    type: String,
  },
});

export default model('Activity', activitySchema);
