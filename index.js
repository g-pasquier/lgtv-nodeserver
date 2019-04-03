var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var fs = require('fs');

try {
  var CONFIG = require('./config')
} catch (e) {
  fs.writeFile("config.json", '{"lgtvip" : "0.0.0.0", "lgtvmac" : "00:00:00:00:00:00"}', function(err) {
    if(err) {
      return console.log(err);
    }
    console.log("Config file created");
  });
} finally {
  console.log(CONFIG);
}

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

app.use(express.static('public'))

app.get('/', function(req, res, next) {
  res.type('html').sendFile(__dirname + '/index.html');
});

app.use('/input', require('./apis/change-input'));
app.use('/volume', require('./apis/change-volume'));
app.use('/alert', require('./apis/alert'));
app.use('/off', require('./apis/turn-off'));
app.use('/on', require('./apis/turn-on'));

app.listen(5555, function () {
  console.log('LGTV http server is up in http://localhost:5555')
})
