'use strict';

/* Services */

angular.module('myApp.services', ['ngResource'])
	.factory("User", function($resource) {
		return $resource('/users/:userId', {
			userId: '@id'
		})
	})
	.factory("Selection", function($resource) {
		return $resource('/selections/:gameId', {
			gameId: '@id'
		})
	})
	.factory("Pick", function($resource) {
		return $resource('/picks/:gameId', {
			gameId: '@id'
		})
	});