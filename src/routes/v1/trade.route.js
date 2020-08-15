const express = require('express');

const validate = require('../../middlewares/validate');
const tradeValidation = require('../../validations/trade.validation');
const tradeController = require('../../controllers/trade.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(tradeValidation.createTrade), tradeController.createTrade)
  .get(validate(tradeValidation.getTrades), tradeController.getTrades);

router
  .route('/:tradeId')
  .get(validate(tradeValidation.getTrade), tradeController.getTrade)
  .patch(validate(tradeValidation.updateTrade), tradeController.updateTrade);

module.exports = router;
