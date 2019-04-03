lgtv = require("lgtv");
/*---------------------------------------------------------------------------*/
var retry_timeout = 10;
var run_test = function() {
        console.log("Found TV at address running example.");
        lgtv.connect('10.0.1.200', function(err, response){
          if (!err) {
            lgtv.open_browser_at("http://github.com/msloth", function(err, response){
              if (!err) {
                lgtv.disconnect();
              }
            });
          }
        });
};

run_test();
