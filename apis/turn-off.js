var lgtv = require("lgtv");
var express = require('express');
var router = express.Router();
var request = require('request');
var CONFIG = require('../config')

var turnOff = function() {
  lgtv.connect(CONFIG.lgtvip, function(err, response){
    lgtv.turn_off(function(err, response){
      if (!err) {
        console.log("turn_off succeeded:" + JSON.stringify(response));
      } else {
        console.log("turn_off failed:" + JSON.stringify(response));
      }
    });
  });
};

router.get('/', function (req, res) {
  turnOff()
  res.send('TV was turned off.')
});

module.exports = router;
