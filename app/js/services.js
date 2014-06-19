'use strict';

/* Services */

angular.module('myApp.services', ['ngResource'])
    .factory("Pick", function($resource) {
        return $resource('/picks/:gameId', {
            gameId: '@id'
        })
    });
