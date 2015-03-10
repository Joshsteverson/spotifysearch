
angular.module('mainApp', ['ngRoute'])
	.config(function ($routeProvider) {
		'use strict';

		$routeProvider.when('/', {
			controller: 'spotify',
			templateUrl: 'templates/spotify.html'
		});

	});
