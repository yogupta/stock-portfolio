const mongoose = require('mongoose');
const validator = require('validator');
const { TradeType } = require('../constants/enums');
const { toJSON, paginate } = require('./plugins');

const trade = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error('Invalid email');
        }
      },
    },
    ticker: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'Securities',
      required: true,
      index: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      validate(val) {
        if (val <= 0) {
          throw new Error('quantity less than 0');
        } else if (val % 1 !== 0) {
          throw new Error('quantity must be a decimal');
        }
      },
    },
    type: {
      type: String,
      required: true,
      enum: Object.values(TradeType),
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

trade.plugin(toJSON);
trade.plugin(paginate);

const Trades = mongoose.model('Trades', trade);

module.exports = Trades;
