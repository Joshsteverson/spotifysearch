angular.module('mainApp')
	.factory('$spotifyapi', function($http){
		'use strict';
 
		var defaultSettings = {
			//url: 'https://api.spotify.com/v1/',
			url: 'http://localhost:3000/',
			endpoint: 'spotify',
			method:'GET',
			params:{q:'All American Organ Grinder', type:'artist'},
			error: function(response) {
				console.log('angularjs http error:');
				console.log(response);
			},
			success: function(response) {
				console.log('angularjs http success:');
				console.log(response);
			}
		};

		this.sendRequest = function(p){
			if( typeof p === 'undefined')
				p = {};

			p = (function(){
					for(var m in defaultSettings){
						if( typeof p[m] === 'undefined' )
							p[m] = defaultSettings[m];
			
						if( typeof p[m] === 'object')
							for(var mm in defaultSettings[m])
								if( typeof p[m][mm] === 'undefined')
									p[m][mm] = defaultSettings[m][mm];

					}						
					return p;
				})();

			$http({
				url: p.url+p.endpoint,
				method: p.method,
				params: p.params
			})
			.success(p.success)
			.error(p.error);

			console.log(p);

			return true;
		}

		return this;
	});