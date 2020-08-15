const Joi = require('@hapi/joi');
const { objectId } = require('./custom.validation');

const createSecurity = {
  body: Joi.object().keys({
    ticker: Joi.string().uppercase().required(),
    price: Joi.number(),
  }),
};

const getSecurities = {
  query: Joi.object().keys({
    ticker: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getSecurity = {
  params: Joi.object().keys({
    securityId: Joi.string().custom(objectId),
  }),
};

const updateSecurity = {
  params: Joi.object().keys({
    securityId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      price: Joi.number(),
    })
    .min(1),
};

module.exports = {
  createSecurity,
  getSecurities,
  getSecurity,
  updateSecurity,
};
