'use strict';

/* Controllers */
angular.module('myApp.controllers', [])
    .controller('PicksCtrl', function($scope, $rootScope, $http, $log, $routeParams) {
        $scope.clicked = false;
        $scope.submitted = false;
        $scope.player = "";
        $scope.selections = [];
        $scope.pots = [];
        $scope.potsel = [];

        $scope.loadPicks = function() {
            if ($routeParams.gameId) {
                $rootScope.gameId = $routeParams.gameId;
            }
            $log.debug('load game and selections: ' + $rootScope.gameId);

            $http.get('/game/' + $rootScope.gameId)
                .then(function(response) {
                    $log.debug('loaded game ' + response.status);
                    $rootScope.game = response.data;

                    return $http.get('/selections/' + $rootScope.gameId);
                })
                .then(function(response) {
                    $log.debug('loaded selections ' + response.status);
                    $scope.selections = response.data;
                    $scope.pots = _.groupBy($scope.selections, 'pot');

                    // set first entry to initial value
                    angular.forEach($scope.pots, function(sels, key) {
                        $scope.potsel[key - 1] = sels[0]._id;
                    });
                });
        }

        $scope.submitSelections = function() {
            $log.debug('submit picks for ' + $scope.player);

            var picks = {
                name: $scope.player,
                game: $rootScope.gameId,
                selections: $scope.potsel
            };

            $scope.clicked = true;
            $http.post('/picks', picks).then(function(response) {
                $scope.submitted = true;
            });
        }
    })
    .controller('TableCtrl', function($scope, $rootScope, $log, $http, $routeParams) {
        $scope.picks = [];
        $scope.picksTotal = [];

        $scope.loadPicks = function() {
            if ($routeParams.gameId) {
                $rootScope.gameId = $routeParams.gameId;
            }
            $log.debug('load game and picks: ' + $rootScope.gameId);
            console.log($routeParams);

            $http.get('/game/' + $rootScope.gameId)
                .then(function(response) {
                    $log.debug('loaded game ' + response.status);
                    $rootScope.game = response.data;

                    return $http.get('/picks/' + $rootScope.gameId)
                })
                .then(function(response) {
                    $log.debug('loaded picks ' + response.status);
                    $scope.picks = response.data;
                    $scope.picksTotal = _.map($scope.picks, function(pick) {
                        return {
                            "name": pick.name,
                            "selections": pick.selections,
                            "total": _.reduce(pick.selections, function(totalSoFar, selection) {
                                return totalSoFar + selection.score;
                            }, 0)
                        }
                    });
                });
        }
    })
    .controller('SelectionsCtrl', function($scope, $rootScope, $log, $http, $routeParams) {
        $scope.selections = [];
        $scope.picksSelections = [];
        $scope.admin = false;
        $scope.adminPass = '';
        $scope.submitted = false;

        $scope.loadSelections = function() {
            if ($routeParams.gameId) {
                $rootScope.gameId = $routeParams.gameId;
            }
            $log.debug('load game and selections: ' + $rootScope.gameId);

            $http.get('/game/' + $rootScope.gameId)
                .then(function(response) {
                    $log.debug('loaded game ' + response.status);
                    $rootScope.game = response.data;

                    return $http.get('/selections/' + $rootScope.gameId)
                })
                .then(function(response) {
                    $log.debug('loaded selections ' + response.status);
                    $scope.selections = response.data;
                    $scope.submitted = false;

                    return $http.get('/picks/' + $rootScope.gameId)
                })
                .then(function(response) {
                    $log.debug('unique picks ' + response.status);
                    $scope.picksSelections = _.chain(response.data)
                        .map(function(pick) {return pick.selections;})
                        .flatten()
                        .uniq(function(pick) {return pick._id;})
                        .value();
                });
        }

        $scope.gameSelections = function() {
            if (['inplay', 'closed'].indexOf($rootScope.game.status) != -1) {
                return $scope.picksSelections;
            } 

            return $scope.selections;
        }

        $scope.adminAuth = function() {
            $log.debug('auth admin for game: ' + $rootScope.gameId);
            $http.get('/game/' + $rootScope.gameId + '/auth/' + $scope.adminPass).then(function(response) {
                if (response.data.auth) {
                    $log.info('auth admin OK');
                    $scope.admin = true;
                }
            });
        }

        $scope.update = function(id, score, offset) {
            $log.debug('auth update for selection: ' + id + ', with value: ' + (score + offset));
            $scope.submitted = true;
            if (_.isNumber(score)) {
                var data = {
                    adminPass: $scope.adminPass,
                    _id: id,
                    score: score + offset
                };

                $http.post('/selections/' + $rootScope.gameId + '/update', data).then(function(response) {
                    $scope.loadSelections();
                });
            }
        }
    })
    .controller('NavCtrl', function($scope, $location) {
        $scope.isActive = function(path) {
            return $location.path().indexOf(path) != -1;
        }
    })
    .controller('GamesCtrl', function($scope, $log, $http) {
        $scope.games = [];

        $scope.loadGames = function() {
            $log.debug('load games');

            $http.get('/games').then(function(response) {
                $log.debug('loaded games ' + response.status);
                $scope.games = response.data;
            });
        }
    })
