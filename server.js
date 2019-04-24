/*
	Refs:
	https://github.com/Danovadia/lgtv-http-server
	https://github.com/hobbyquaker/lgtv2/
	https://github.com/hobbyquaker/lgtv2/issues/23
	
	GFI V1.0 - 16/04/2019
	
*/
var express = require('express')
var app = express()
var bodyParser = require('body-parser');
var fs = require('fs');
var schedule = require('node-schedule');


var url_borne = "https://borne-gfi.azurewebsites.net/";
//var url_borne = "http://172.16.14.101:8080/tv";


try {
	var CONFIG = require('./config.json')
} catch (e) {
	fs.writeFile("config.json", '{"lgtv_ip" : "0.0.0.0", "lgtvmac" : "00:00:00:00:00:00"}', function(err) {
  });
} finally {
	console.log(CONFIG);
}
var tv_ip_address = CONFIG.lgtv_ip;
var cron = CONFIG.cron;
var clientKey = CONFIG.clientKey;

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(express.static('public'))

app.get('/tv', function(req, res, next) {
  res.type('html').sendFile(__dirname + '/Borne/wwwroot/index.html');
});

// -- MIME-TYPE handling for the TV Borne --
app.use('/css', express.static('./Borne/wwwroot/css'));
app.use('/js', express.static('./Borne/wwwroot/js'));
app.use('/libs', express.static('./Borne/wwwroot/libs'));
app.use('/', express.static('./Borne/wwwroot/'));

console.log("Started : " + new Date());


var lgtv = require('./index.js')({
	url: 'ws://' + tv_ip_address + ':3000', clientKey: clientKey
});

lgtv.on('error', function (err) {
    console.log(err);
});

lgtv.on('connecting', function () {
    console.log('connecting to LGTV... ' + tv_ip_address + " on " + new Date());
});

lgtv.on('connect', function () {
    console.log('connected on ' + new Date());

	lgtv.request('ssap://com.webos.service.update/getCurrentSWInformation', '', function(err, resp) {
		if (!err) {
			console.log('webos: ' + JSON.stringify(resp));
		}
	});
	
	// open_browser
	var payload = '{"target":"' + url_borne + '"}'
	console.log("send_command = " + payload);
	lgtv.request('ssap://system.launcher/open', payload, function (err, data) {
		if (!err) {
			// mute
			console.log("send_command = audio/setMute..");
			lgtv.request('ssap://audio/setMute', {mute: true});
			
			// full screen
			lgtv.getSocket('ssap://com.webos.service.networkinput/getPointerInputSocket',
			  function(err, sock) {
				  if (!err) {
					  const command = "move\n" + "dx:" + 11 + "\n" + "dy:-8\n" + "down:0\n" + "\n";
					  
					  for (let i=0; i < 22; i++) {
						console.log('Pointer move.. ' + i);
						sock.send(command);
					  }
					  setTimeout(()=>sock.send('click'), 5000);
					  console.log('Pointer click..');
				  } else {
					  console.log('getPointerInputSocket Error ' + err);
				  }
			  }
			);
		}
	}); //lgtv.request
		
});

lgtv.on('prompt', function () {
    console.log('please authorize on TV');
});

lgtv.on('close', function () {
    console.log('close');
});


/* Cron-style Scheduling
The cron format consists of:
00  30  08  *   *   1-5
*	*	*	*	*	*
┬	┬	┬	┬	┬	┬
│	│	│	│	│	│
│	│	│	│	│	└ day of week (0 - 7) (0 or 7 is Sun)
│	│	│	│	└───── month (1 - 12)
│	│	│	└────────── day of month (1 - 31)
│	│	└─────────────── hour (0 - 23)
│	└──────────────────── minute (0 - 59)
└───────────────────────── second (0 - 59, OPTIONAL) */
app.listen(8080, function () {
	console.log('LGTV server is up to http://localhost:8080');

	/*
	 do_exec = send commands
	 */
	var do_exec = function() {
		console.log("Started : " + new Date());

		// open_browser
		var payload = '{"target":"' + url_borne + '"}'
		console.log("send_command = " + payload);
		lgtv.request('ssap://system.launcher/open', payload, function (err, data) {
			if (!err) {
				// mute
				console.log("send_command = audio/setMute..");
				lgtv.request('ssap://audio/setMute', {mute: true});
				
				// full screen
				lgtv.getSocket('ssap://com.webos.service.networkinput/getPointerInputSocket',
				  function(err, sock) {
					  if (!err) {
						  const command = "move\n" + "dx:" + 11 + "\n" + "dy:-8\n" + "down:0\n" + "\n";
						  
						  for (let i=0; i < 22; i++) {
							console.log('Pointer move.. ' + i);
							sock.send(command);
						  }
						  setTimeout(()=>sock.send('click'), 5000);
						  console.log('Pointer click..');
					  } else {
						  console.log('getPointerInputSocket Error ' + err);
					  }
				  }
				);
			}
		}); //lgtv.request		
	};
	
	var open_browser_at = schedule.scheduleJob(""+cron[0], function() {
		do_exec();
	});	
	var open_browser_at = schedule.scheduleJob(""+cron[1], function() {
		do_exec();
	});
		
})
