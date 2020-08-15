const express = require('express');

const docsRoute = require('./docs.route');
const securityRoute = require('./security.route');

const router = express.Router();

router.use('/docs', docsRoute);
router.use('/security', securityRoute);

module.exports = router;
