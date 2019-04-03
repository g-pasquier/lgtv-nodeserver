var lgtv = require("../lgtv");
var express = require('express');
var router = express.Router();
var request = require('request');
var CONFIG = require('../config')

var changeVolume = function(volume) {
  lgtv.connect(CONFIG.lgtvip, function(err, response){
    if (!err) {
      lgtv.set_volume(volume, function(err, response){
      });
    }
  });
};

router.get('/:volume', function (req, res) {
  var volume = Number(req.params.volume);
  if (volume > 99) {
    res.send('Invalid volume. Please set between 0-99.')
  } else {
    changeVolume(volume);
    res.send('Volume was set to ' + volume)
  }
});


module.exports = router;
