const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { tradeService } = require('../services');

const createTrade = catchAsync(async (req, res) => {
  const trade = await tradeService.createTrade(req.body);
  res.status(httpStatus.CREATED).send(trade);
});

const getTrades = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'ticker']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await tradeService.queryTrades(filter, options);
  res.send(result);
});

const getTrade = catchAsync(async (req, res) => {
  const trade = await tradeService.getTradeById(req.params.tradeId);
  if (!trade) {
    throw new ApiError(httpStatus.NOT_FOUND, 'trade not found');
  }
  res.send(trade);
});

const getTradeByEmail = catchAsync(async (req, res) => {
  const result = await tradeService.getTradeByEmail(req.params.emailId);
  res.send(result);
});

const updateTrade = catchAsync(async (req, res) => {
  const trade = await tradeService.updateTradeById(req.params.tradeId, req.body);
  res.send(trade);
});

const getPortFolio = catchAsync(async (req, res) => {
  const result = await tradeService.getPortFolio(req.params.emailId);
  res.send(result);
});

module.exports = {
  createTrade,
  getTrades,
  getTrade,
  getTradeByEmail,
  updateTrade,
  getPortFolio,
};
