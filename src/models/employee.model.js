const mongoose = require('mongoose');
const validator = require('validator');
const { toJSON, paginate } = require('./plugins');

const EmployeeSchema = mongoose.Schema(
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
    status: {
      type: Boolean,
      required: true,
    },
    skills: {
      type: Object,
      default: [],
    },
    phone: {
      type: String,
      required: true,
    },
    designation: {
      type: String,
      enum: ['TL', 'SE', 'UI'],
      default: 'SE',
    },
    permanent: {
      type: Boolean,
      enum: [true, false],
      default: true,
    },
    isDeleted: {
      type: Boolean,
      enum: [true, false],
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

EmployeeSchema.statics.checkIfAvailable = async (flag, value, excludeUserId) => {
  if (flag === 'phone') {
    const phone = value;
    /* eslint-disable-next-line no-use-before-define */
    const user = await Employee.findOne({ phone, _id: { $ne: excludeUserId }, isDeleted: false });
    return !!user;
  }
  const email = value;
  /* eslint-disable-next-line no-use-before-define */
  const user = await Employee.findOne({ email, _id: { $ne: excludeUserId }, isDeleted: false });
  return !!user;
};

// add plugin that converts mongoose to json and pagination
EmployeeSchema.plugin(toJSON);
EmployeeSchema.plugin(paginate);

/**
 * @typedef User
 */
const Employee = mongoose.model('Employee', EmployeeSchema);

module.exports = Employee;
