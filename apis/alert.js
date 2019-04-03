var lgtv = require("lgtv");
var express = require('express');
var router = express.Router();
var request = require('request');
var CONFIG = require('../config')

var popAlert = function(alert) {
  lgtv.connect(CONFIG.lgtvip, function(err, response){
    if (!err) {
      lgtv.show_float(alert, function(err, response){
        if (!err) {
          console.log('Alert fired: ' + alert);
        }
      });
    }
  });
};

router.get('/:alert', function (req, res) {
  var alert = req.params.alert;
  popAlert(alert);
  res.send('Alert fired: ' + alert)
});

module.exports = router;
