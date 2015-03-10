
(function(){

	var express = require('express'),
		app = express(),
		searchHandler = function(req, resp){
			
			var spotify = require('./spotifysearch'),
				cb = function(r, resp) {
					resp.header("Access-Control-Allow-Origin", "*");
				  	resp.header("Access-Control-Allow-Headers", "X-Requested-With");
					resp.send(r);
				};

			spotify.search(req.query, cb, resp);

		};

	app.get('/spotify', searchHandler);

	app.listen(3000, function () {

		var host = this.address().address,
	  		port = this.address().port;

	  	console.log('Listening -- %s:%s', host, port);

	});

})();