/*global angular */

angular.module('mainApp')
	.controller('main', function main($scope, $routeParams, $filter, $location, $window, $http) {
		'use strict';

		var menuitems = $scope.menuitems = getMenu(),
			header = $scope.header = {name:'Josh Steverson', title: 'Professional JavaScript Developer'},
			contact = $scope.contact = getContact(),
			showdemo = $scope.showdemo = (($location.path().indexOf('demo') > -1) ? true : false),
			showgit = $scope.showgit = (($location.path().indexOf('github') > -1) ? true : false),
			showcontact = $scope.showcontact = (($location.path().indexOf('contact') > -1) ? true : false),
			showhome = $scope.showhome = (($location.path() === '/') ? true : false),
			menuMessage = $scope.menuMessage = '';

		function getMenu() {
			return [
				{url:'home', display:'home', message:''}, 
				{url:'resume', display:'resume', message:'See what I\'ve been up to.'},
				{url:'demos', display:'demos', message:'Check out some of my work.'},
				{url:'contact', display:'contact', message:'404 Not Found.'},
				{url:'github', display:'github', message:'Look at my code.'}
					
			];
		}

		function getContact() {
			return [
				{friendly:'Gmail', icon:'assets/gmail_icon.png', url:'mailto:joshsteverson@gmail.com'}, 
				{friendly:'LinkedIn', icon:'assets/linkedin_icon2.png', url:'https://www.linkedin.com/profile/view?id=5044472'},
				{friendly:'Github', icon:'assets/github.png', url:'https://github.com/Joshsteverson/'},
				{friendly:'Stack Overflow', icon:'assets/stackoverflow.jpg', url:'http://stackoverflow.com/users/3511363/josh'}
				//{friendly:'Mail me contact info', icon:'assets/mailcontact.png', url:'https://www.linkedin.com/profile/view?id=5044472'}
			]
		}

		$scope.doNav = function(path) {
			$location.path(path);
		};

		$scope.setMessage = function(item) {
			if(typeof item === 'undefined'){
				$scope.menuMessage = '';
				return;
			}			

			$scope.menuMessage = $filter('filter')($scope.menuitems,{display:item})[0].message;

		}

	});
	