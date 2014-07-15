'use strict';

angular

// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngRoute', 'myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers'])
	.run(function($rootScope) {
		$rootScope.gameId = '53959190e4b0a2f0b57062b8';
	})
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/table/:gameId?', {
				templateUrl: '/app/partials/table.html',
				controller: 'TableCtrl'
			});
			$routeProvider.when('/selections/:gameId?', {
				templateUrl: '/app/partials/selections.html',
				controller: 'SelectionsCtrl'
			});
			$routeProvider.when('/picks/:gameId?', {
				templateUrl: '/app/partials/picks.html',
				controller: 'PicksCtrl'
			});
			$routeProvider.when('/games', {
				templateUrl: '/app/partials/games.html',
				controller: 'GamesCtrl'
			});
			$routeProvider.otherwise({
				redirectTo: '/games'
			});
		}
	]);