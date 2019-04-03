var lgtv = require("lgtv");
var express = require('express');
var router = express.Router();
var request = require('request');
var wol = require('node-wol');
var CONFIG = require('../config')

var turnOn = function() {
  wol.wake(CONFIG.lgtvmac, {
    address: CONFIG.lgtvip,
    port: 3000
  }, function(error) {
    if(error) {
      return;
    }
  });
  var magicPacket = wol.createMagicPacket(CONFIG.lgtvmac);
};

router.get('/', function (req, res) {
  turnOn()
});

module.exports = router;
