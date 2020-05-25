const express = require('express');
const router = express.Router();
const helpers = require('../helpers');
const fs = require('fs');
const savedText = require('../text');

/* GET home page. */
router.get('/', helpers.asyncHandler( async (req, res, next) => {
  res.render('index', { title: 'Simple Chat', chatText: savedText.text });
}));

router.post('/', helpers.asyncHandler( async (req, res, next) => {
  // console.dir(req.body);

  savedText.text.push(req.body.text);

  if (savedText.text.length > 50) {
    savedText.text.splice(0, savedText.text.length - 50);
  }

  const newText = {
    "text": [...savedText.text]
  }

  await fs.promises.writeFile(`./text.json`, JSON.stringify(newText));

  res.render('index', { title: 'Simple Chat', chatText: savedText.text });
}));

module.exports = router;
