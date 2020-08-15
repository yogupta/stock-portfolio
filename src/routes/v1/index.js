const express = require('express');

const docsRoute = require('./docs.route');

const router = express.Router();

router.use('/docs', docsRoute);

module.exports = router;
