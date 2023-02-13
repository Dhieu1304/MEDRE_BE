const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const { toJSON, paginate } = require('../plugins');
const { ROLES, GENDERS, USER_STATUS } = require('./user.constant');
const { phoneNumberRegex } = require('../utils/validateCustom');

const userSchema = mongoose.Schema(
  {
    phoneNumber: {
      type: String,
      required: true,
      trim: true,
      validate(value) {
        if (!value.match(phoneNumberRegex)) {
          throw new Error('Invalid phone number');
        }
      },
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      lowercase: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    password: {
      type: String,
      trim: true,
      minlength: 8,
      validate(value) {
        if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
      private: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ROLES,
      default: ROLES.USER,
    },
    image: {
      type: String,
    },
    address: {
      type: String,
      trim: true,
    },
    gender: {
      type: String,
      enum: GENDERS,
      default: GENDERS.OTHER,
    },
    dob: {
      type: Date,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: USER_STATUS,
      default: USER_STATUS.OK,
    },
    healthInsurance: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(toJSON);
userSchema.plugin(paginate);

userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;
