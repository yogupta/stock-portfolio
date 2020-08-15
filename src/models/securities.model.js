const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const securities = mongoose.Schema(
  {
    ticker: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      uppercase: true,
      minlength: 1,
      index: true,
    },
    price: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
);

securities.plugin(toJSON);
securities.plugin(paginate);

securities.statics.isTickerTaken = async function (ticker) {
  const entry = await this.findOne({ ticker });
  return !!entry;
};

const Securities = mongoose.model('Securities', securities);

module.exports = Securities;
