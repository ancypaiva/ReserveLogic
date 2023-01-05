/* eslint-disable consistent-return */
/* eslint-disable func-names */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    phone: {
      type: String,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true, // used by the toJSON plugin
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Roles',
    },
    active: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    isDeleted: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    isVerified: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
    image: {
      type: String,
      default: process.env.DEFAULT_IMG,
    },
    dateOfBirth: {
      type: Date,
      trim: true,
    },
    files: {
      type: Object,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json and pagination
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email or phone is taken
 * @param {string} flag - Flag to switch email or phone
 * @param {string} value - email or phone
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.checkIfAvailable = async (flag, value, excludeUserId) => {
  if (flag === 'phone') {
    const phone = value;
    /* eslint-disable-next-line no-use-before-define */
    const user = await User.findOne({ phone, _id: { $ne: excludeUserId }, isDeleted: false });
    return !!user;
  }
  const email = value;
  /* eslint-disable-next-line no-use-before-define */
  const user = await User.findOne({ email, _id: { $ne: excludeUserId }, isDeleted: false });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function passMatch(password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};
// eslint-disable-next-line consistent-return
userSchema.methods.isDeletedTrue = async function () {
  const user = this;
  if (user.isDeleted === true) {
    return true;
  }
};
// eslint-disable-next-line consistent-return
userSchema.methods.isVerifiedTrue = async function () {
  const user = this;
  if (user.isVerified === true) {
    return true;
  }
};
userSchema.methods.isActive = async function () {
  const user = this;
  if (user.active === true) {
    return true;
  }
};

// pre save hook to encrypt password only if it is changed
userSchema.pre('save', async function passHashing(next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 8);
  }
  next();
});

/**
 * @typedef User
 */
const User = mongoose.model('User', userSchema);

module.exports = User;
