const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');
const { TradeType } = require('../constants/enums');

const createTrade = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    ticker: Joi.required().custom(objectId),
    price: Joi.number().required(),
    quantity: Joi.number().integer().min(1).required(),
    type: Joi.string()
      .required()
      .valid(...Object.values(TradeType)),
  }),
};

const getTrades = {
  query: Joi.object()
    .keys({
      email: Joi.string().email(),
      type: Joi.string().valid(...Object.values(TradeType)),
      sortBy: Joi.string(),
      limit: Joi.number().integer(),
      page: Joi.number().integer(),
    })
    .min(1),
};

const getTradesOfUser = {
  params: Joi.object().keys({
    emailId: Joi.string().email().required(),
  }),
};

const getTrade = {
  params: Joi.object().keys({
    tradeId: Joi.string().custom(objectId),
  }),
};

const updateTrade = {
  params: Joi.object().keys({
    tradeId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      price: Joi.number(),
      quantity: Joi.number().integer().min(1),
      type: Joi.string().valid(...Object.values(TradeType)),
    })
    .min(1),
};

const getPortFolio = {
  params: Joi.object().keys({
    emailId: Joi.string().email().required(),
  }),
};

const getReturns = {
  params: Joi.object().keys({
    emailId: Joi.string().email().required(),
  }),
};

module.exports = {
  createTrade,
  getTrades,
  getTradesOfUser,
  getTrade,
  updateTrade,
  getPortFolio,
  getReturns,
};
