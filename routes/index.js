const express = require('express');
const router = express.Router();
const helpers = require('../helpers');
const savedText = require('../text');

/* GET home page. */
router.get('/', helpers.asyncHandler( async (req, res, next) => {
  // const formattedText = savedText.text.map((arr, i) => {
  //   return `${arr[0]}: ${arr[1]}<p class="chat-msg">${arr[2]}</p>`;
  // });

  res.render('index', { title: 'Simple Chat', chatText: savedText.text });
}));

module.exports = router;
