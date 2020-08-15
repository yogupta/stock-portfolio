const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { securityService } = require('../services');

const createSecurity = catchAsync(async (req, res) => {
  const security = await securityService.createSecurity(req.body);
  res.status(httpStatus.CREATED).send(security);
});

const getSecurities = catchAsync(async (req, res) => {
  const filter = pick(req.query, ['type', 'ticker']);
  const options = pick(req.query, ['sortBy', 'limit', 'page']);
  const result = await securityService.querySecurities(filter, options);
  res.send(result);
});

const getSecurity = catchAsync(async (req, res) => {
  const security = await securityService.getSecurityById(req.params.securityId);
  if (!security) {
    throw new ApiError(httpStatus.NOT_FOUND, 'security not found');
  }
  res.send(security);
});

const updateSecurity = catchAsync(async (req, res) => {
  const security = await securityService.updateSecurityById(req.params.securityId, req.body);
  res.send(security);
});

module.exports = {
  createSecurity,
  getSecurities,
  getSecurity,
  updateSecurity,
};
