var lgtv = require("lgtv");
var express = require('express');
var router = express.Router();
var request = require('request');
var CONFIG = require('../config')

var changeInput = function(input) {
  lgtv.connect(CONFIG.lgtvip, function(err, response){
    if (!err) {
      lgtv.set_input(input, function(err, response){
        if (!err) {
          console.log('Input was changed to ' + input);
        }
      });
    }
  });
};

router.get('/:input', function (req, res) {
  var input = req.params.input;
  changeInput(input);
  res.send('Input was set to ' + input)
});

module.exports = router;
