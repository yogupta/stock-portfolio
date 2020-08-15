const httpStatus = require('http-status');
const { Trades } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * Create a trade
 * @param {Object} trade
 * @returns {Promise<Trades>}
 */
const createTrade = async (trade) => {
  const _trade = await Trades.create(trade);
  return _trade;
};

/**
 * Query for Trades
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryTrades = async (filter, options) => {
  const trades = await Trades.paginate(filter, options);
  return trades;
};

/**
 * Get trade by id
 * @param {ObjectId} id
 * @returns {Promise<Trades>}
 */
const getTradeById = async (id) => {
  return Trades.findById(id);
};

/**
 * Get Trade by ticker
 * @param {string} ticker
 * @returns {Promise<QueryResult>}
 */
const getTradeByEmail = async (email) => {
  return Trades.findMany({ email });
};

/**
 * Update Trade by id
 * @param {ObjectId} tradeId
 * @param {Object} updateBody
 * @returns {Promise<Trades>}
 */
const updateTradeById = async (tradeId, updateBody) => {
  const trade = await getTradeById(tradeId);
  if (!trade) {
    throw new ApiError(httpStatus.NOT_FOUND, 'Trade not found');
  }
  if (updateBody.ticker) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'Ticker update not allowed');
  } else if (updateBody.email) {
    throw new ApiError(httpStatus.BAD_REQUEST, 'email update not allowed');
  }
  Object.assign(trade, updateBody);
  await trade.save();
  return trade;
};

module.exports = {
  createTrade,
  queryTrades,
  getTradeById,
  getTradeByEmail,
  updateTradeById,
};
