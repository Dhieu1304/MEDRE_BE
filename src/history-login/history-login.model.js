const mongoose = require('mongoose');
const { toJSON, paginate } = require('../plugins');
const { Types } = require('mongoose');
const { HISTORY_LOGIN } = require('./history-login.constant');

const historyLoginSchema = mongoose.Schema(
  {
    userId: {
      type: Types.ObjectId,
      required: true,
    },
    accessToken: {
      type: String,
      trim: true,
      private: true,
    },
    refreshToken: {
      type: String,
      trim: true,
      private: true,
    },
    historyType: {
      type: String,
      enum: HISTORY_LOGIN,
      default: HISTORY_LOGIN.PHONE,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

historyLoginSchema.plugin(toJSON);
historyLoginSchema.plugin(paginate);

const HistoryLogin = mongoose.model('HistoryLogin', historyLoginSchema);

module.exports = HistoryLogin;
