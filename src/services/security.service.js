const httpStatus = require('http-status');
const { Securities } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a security
 * @param {Object} security
 * @returns {Promise<Securities>}
 */
const createSecurity = async (security) => {
  if (await Securities.isTickerTaken(security.ticker)) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Ticker already taken');
  }
  const _security = await Securities.create(security);
  return _security;
};

/**
 * Query for securities
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const querySecurities = async (filter, options) => {
  const securities = await Securities.paginate(filter, options);
  return securities;
};

/**
 * Get security by id
 * @param {ObjectId} id
 * @returns {Promise<Securities>}
 */
const getSecurityById = async (id) => {
  return Securities.findById(id);
};

/**
 * Get Security by ticker
 * @param {string} ticker
 * @returns {Promise<Securities>}
 */
const getSecurityByTicker = async (ticker) => {
  return Securities.findOne({ ticker });
};

/**
 * Update Security by id
 * @param {ObjectId} securityId
 * @param {Object} updateBody
 * @returns {Promise<Securities>}
 */
const updateSecurityById = async (securityId, updateBody) => {
  const security = await getSecurityById(securityId);
  if (!security) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Security not found');
  }
  if (updateBody.ticker) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Ticker update not allowed');
  }
  Object.assign(security, updateBody);
  await security.save();
  return security;
};

module.exports = {
  createSecurity,
  querySecurities,
  getSecurityById,
  getSecurityByTicker,
  updateSecurityById,
};
