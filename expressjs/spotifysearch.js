(function(){
	
	exports.search = function(query, cb, resp){
		
		var request = require('request'),
			qs = require('querystring'),
			url = 'https://api.spotify.com/v1/search?'+qs.stringify(query),
			searchHandler = function(e,r,b){
				console.log('a response');
				cb(r, resp);
			};

		request.get(url, searchHandler);
		
	};

})();