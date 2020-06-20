const express = require('express');
const router = express.Router();
const helpers = require('../helpers');
const savedText = require('../text');

/* GET home page. */
router.get('/', helpers.asyncHandler( async (req, res, next) => {
  res.render('index', { title: 'Simple Chat', chatText: savedText.text });
}));

module.exports = router;
