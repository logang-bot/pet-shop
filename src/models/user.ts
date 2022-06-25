import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

import crypto from 'crypto';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Debe proveer un nombre'],
    },
    ci: {
      type: String,
      required: [true, 'Debe proveer un CI valido'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Debe proveer un email'],
      unique: true,
      lowercase: true,
      validate: [
        validator.isEmail,
        'Por favor revise que el email proporcionado sea valido',
      ],
    },
    password: {
      type: String,
      required: [true, 'Debe proveer un password'],
      // minlength: 8,
      validate: {
        validator: function (el: string) {
          return el.length >= 8;
        },
        message:
          'Por favor asegurese que el password ingresado contenga al menos 8 caracteres',
      },
      select: false,
    },
    passwordConfirm: {
      type: String,
      required: [true, 'La confirmacion del password es requerida'],
      validate: {
        // This only works on CREATE and SAVE, NOT in update methods
        validator: function <T extends { password: string }>(el: string) {
          const user = this as T;
          // console.log('this is: ', JSON.stringify(user));
          return el === user.password;
        },
        message: 'Los password no son los mismos',
      },
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    photo: {
      type: String,
      default: 'default.jpg',
    },
    role: {
      type: String,
      enum: ['user', 'worker', 'lead-worker', 'admin'],
      default: 'user',
    },
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  // Only run this function if password was actually modified
  if (!this.isModified('password')) return next();

  // Hash the password with cost of 12
  this.password = await bcrypt.hash(this.password, 12);

  // Delete the password confirm field
  this.passwordConfirm = undefined;
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// The regular expression to find is useful for all queries with 'find' keyword at the beginning
userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

// Regular methods are available in created documents
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changeTimestamp = parseInt(
      (this.passwordChangedAt.getTime() / 1000).toString(),
      10
    );

    return JWTTimestamp < changeTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export default mongoose.model('User', userSchema);
