'use strict';

/* Services */

angular.module('myApp.services', ['ngResource'])
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