'use strict';


// Declare app level module which depends on filters, and services
angular.module('myApp', ['ngRoute', 'myApp.filters', 'myApp.services', 'myApp.directives', 'myApp.controllers'])
	.config(['$routeProvider',
		function($routeProvider) {
			$routeProvider.when('/users', {
				templateUrl: '/app/partials/users.html',
				controller: 'UserCtrl'
			});
			$routeProvider.when('/selections', {
				templateUrl: '/app/partials/selections.html',
				controller: 'SelectionsCtrl'
			});
			$routeProvider.when('/about', {
				templateUrl: '/app/partials/about.html',
				controller: 'AboutCtrl'
			});
			$routeProvider.otherwise({
				redirectTo: '/selections'
			});
		}
	]);