const express = require('express');
const router = express.Router();
const helpers = require('../helpers');

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.send('respond with a resource');
});

module.exports = router;
