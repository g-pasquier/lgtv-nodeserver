var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var fs = require('fs');
var schedule = require('node-schedule');

var wol = require('node-wol');
var url_borne = "https://borne-gfi.azurewebsites.net/";


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

lgtv = require("lgtv");

/*
 At startup get audio status and force Mute
 */
lgtv.connect(CONFIG.lgtvip, function(err, response){
	lgtv.get_status(function(err, response){
		if (!err) {
		  console.log("get status ok:" + JSON.stringify(response));
		  var mute = response.payload.mute;
		  console.log("Volume is " + response.payload.volume + " and Mute is " + mute);
		  if (mute == false) {
			  lgtv.set_mute(true);
		  }
		} else {
		  console.log("get status err:" + JSON.stringify(response));
		}
		lgtv.disconnect();
	});
});

/* Cron-style Scheduling
The cron format consists of:
*    *    *    *    *    *
┬    ┬    ┬    ┬    ┬    ┬
│    │    │    │    │    │
│    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
│    │    │    │    └───── month (1 - 12)
│    │    │    └────────── day of month (1 - 31)
│    │    └─────────────── hour (0 - 23)
│    └──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL) */
app.listen(5555, function () {
	console.log('LGTV http server is up to http://localhost:5555');
    
	// Not working...
	var turn_tv_on = schedule.scheduleJob('00 55 08 * * 1-5', function() {
		console.log("turn_tv_on...");
		var turnOn = function() {
			wol.wake(CONFIG.lgtvmac, function(error) {
				if(error) {
				  console.log(error);
				  return;
				}
				var magicPacket = wol.createMagicPacket(CONFIG.lgtvmac);
			});
		};
		turnOn();		  
	});

	/*
	 at 09:00:00
	 */	
	var open_browser_at = schedule.scheduleJob('00 00 09 * * 1-5', function() {
		// Connect to TV:
		lgtv.connect(CONFIG.lgtvip, function(err, response){
		  if (!err) {
			console.log("Connected");
			console.log("open_browser_at...");
			
			// open_browser_at:
		    lgtv.open_browser_at(url_borne, function(err, response){
				if (!err) {
				  console.log("open_browser_at ok:" + JSON.stringify(response));
				} else {
				  console.log("open_browser_at err:" + JSON.stringify(err));
				}
			});
		  }
		  lgtv.disconnect();
		});
	});
	
	/*
	 at 09:00:05
	 */	
	var mute_on = schedule.scheduleJob('05 00 09 * * 1-5', function() {
		// Connect to TV:
		lgtv.connect(CONFIG.lgtvip, function(err, response){
		  if (!err) {
			console.log("Connected");
			console.log("mute_on...");
			
		    lgtv.set_mute(true, function(err, response){
				if (!err) {
				  console.log("set_mute ok:" + JSON.stringify(response));
				} else {
				  console.log("set_mute err:" + JSON.stringify(err));
				}
			});
		  }
		  lgtv.disconnect();
		});
	});

	/*
	 at 14:00:00
	 */	
	var open_browser_at2 = schedule.scheduleJob('00 00 14 * * 1-5', function() {
		// Connect to TV:
		lgtv.connect(CONFIG.lgtvip, function(err, response){
		  if (!err) {
			console.log("Connected");
			console.log("open_browser_at...");
			
			// open_browser_at:
		    lgtv.open_browser_at(url_borne, function(err, response){
				if (!err) {
				  console.log("open_browser_at ok:" + JSON.stringify(response));
				} else {
				  console.log("open_browser_at err:" + JSON.stringify(err));
				}
			});
		  }
		  lgtv.disconnect();
		});
	});
	
	/*
	 at 14:00:05
	 */
	var mute_on2 = schedule.scheduleJob('05 00 14 * * 1-5', function() {
		// Connect to TV:
		lgtv.connect(CONFIG.lgtvip, function(err, response){
		  if (!err) {
			console.log("Connected");
			console.log("mute_on...");
			
		    lgtv.set_mute(true, function(err, response){
				if (!err) {
				  console.log("set_mute ok:" + JSON.stringify(response));
				} else {
				  console.log("set_mute err:" + JSON.stringify(err));
				}
			});
		  }
		  lgtv.disconnect();
		});
	});
	
	var turn_off = schedule.scheduleJob('00 30 19 * * 1-5', function() {
		// Connect to TV:
		lgtv.connect(CONFIG.lgtvip, function(err, response){
		  if (!err) {
			console.log("Connected");
			console.log("turn_off...");
			
		    lgtv.turn_off();
		  }
		  lgtv.disconnect();
		});
	});
	
})
