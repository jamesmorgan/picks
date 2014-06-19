'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngRoute', 'myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/table', {
				templateUrl: '/app/partials/table.html',
				controller: 'TableCtrl'
			});
			$routeProvider.when('/selections', {
				templateUrl: '/app/partials/selections.html',
				controller: 'SelectionsCtrl'
			});
			$routeProvider.when('/picks', {
				templateUrl: '/app/partials/picks.html',
				controller: 'PicksCtrl'
			});
			$routeProvider.when('/games', {
				templateUrl: '/app/partials/games.html',
				controller: 'GamesCtrl'
			});
			$routeProvider.otherwise({
				redirectTo: '/table'
			});
		}
	]);