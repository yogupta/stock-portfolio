const express = require('express');

const validate = require('../../middlewares/validate');
const securityValidation = require('../../validations/security.validation');
const securityController = require('../../controllers/security.controller');

const router = express.Router();

router
  .route('/')
  .post(validate(securityValidation.createSecurity), securityController.createSecurity)
  .get(validate(securityValidation.getSecurities), securityController.getSecurities);

router
  .route('/:securityId')
  .get(validate(securityValidation.getSecurity), securityController.getSecurity)
  .patch(validate(securityValidation.updateSecurity), securityController.updateSecurity);

module.exports = router;
