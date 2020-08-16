const httpStatus = require('http-status');
const { Trades, Securities } = require('../models');
const ApiError = require('../utils/ApiError');

const { TradeType } = require('../constants/enums');

/**
 * Create a trade
 * @param {Object} trade
 * @returns {Promise<Trades>}
 */
const createTrade = async (trade) => {
  await Securities.findById(trade.ticker);
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
  return Trades.find({ email }).exec();
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

const getPortFolio = async (email) => {
  const tradesPromise = Trades.aggregate([
    { $match: { email } },
    {
      $group: {
        _id: '$ticker',

        trades: { $push: '$$ROOT' },
      },
    },
  ])
    .exec()
    .then((trades) => {
      const allTickers = trades.map((trade) => trade._id);

      const securitiesPromise = Securities.find({ _id: { $in: allTickers } }).exec();

      const result = securitiesPromise.then((securities) => {
        const tickerById = {};
        securities.forEach((security) => {
          tickerById[security._id] = security.ticker;
        });

        return trades.map((entry) => {
          const tickerId = entry._id;
          const ticker = tickerById[tickerId];
          const buyTrades = entry.trades.filter((trade) => trade.type === TradeType.buy);
          const sellTrades = entry.trades.filter((trade) => trade.type === TradeType.sell);

          const buyQuantity = buyTrades.map((trade) => trade.quantity).reduce((sum, current) => sum + current, 0);
          const sellQuantity = sellTrades.map((trade) => trade.quantity).reduce((sum, current) => sum + current, 0);
          const totalBuyPrice = buyTrades
            .map((trade) => trade.quantity * trade.price)
            .reduce((sum, current) => sum + current, 0);
          const trade = {
            ticker,
            quantity: buyQuantity - sellQuantity,
            averageBuyPrice: totalBuyPrice / buyQuantity,
          };

          return trade;
        });
      });

      return result;
    });

  return tradesPromise;
};

const getReturns = async (email) => {
  const tradesPromise = getPortFolio(email);

  const returns = tradesPromise.then(async (trades) => {
    const securities = await Trades.aggregate([
      { $match: { email } },
      {
        $group: {
          _id: '$ticker',
        },
      },
    ])
      .exec()
      .then((tickers) => {
        return tickers.map((ticker) => ticker._id);
      })
      .then((tickerIds) => Securities.find({ _id: { $in: tickerIds } }).exec());

    const priceOfSecurityByTicker = {};
    securities.forEach((security) => {
      priceOfSecurityByTicker[security.ticker] = security.price;
    });

    const _returns = trades.reduce((sum, trade) => {
      const _sum = (priceOfSecurityByTicker[trade.ticker] - trade.averageBuyPrice) * trade.quantity;
      return sum + _sum;
    }, 0);

    return { returns: _returns };
  });

  return returns;
};

module.exports = {
  createTrade,
  queryTrades,
  getTradeById,
  getTradeByEmail,
  updateTradeById,
  getPortFolio,
  getReturns,
};
