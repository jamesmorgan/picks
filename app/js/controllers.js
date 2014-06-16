'use strict';

var GAME_ID = '53959190e4b0a2f0b57062b8';

/* Controllers */
angular.module('myApp.controllers', [])
  .controller('PicksCtrl', function($scope, $http, $log, Selection, Pick) {
    $scope.game = {};
    $scope.submitted = false;
    $scope.player = "";
    $scope.selections = [];
    $scope.pots = [];
    $scope.potsel = [];

    $scope.loadPicks = function() {
      $log.debug('load game and selections: ' + GAME_ID);

      $http.get('/game/' + GAME_ID).then(function(response) {
        $log.debug('loaded game ' + response.status);
        $scope.game = response.data;

        $scope.selections = Selection.query({
            gameId: GAME_ID
          },
          function() {
            $scope.pots = _.groupBy($scope.selections, 'pot');
            angular.forEach($scope.pots, function(sels, key) {
              $scope.potsel[key - 1] = sels[0]._id;
            });
          });
      });
    }

    $scope.submitSelections = function() {
      console.log($scope);
      $log.debug('submit picks for ' + $scope.player);
      var picks = new Pick({
        name: $scope.player,
        game: GAME_ID,
        selections: $scope.potsel
      });
      picks.$save();
      $scope.submitted = true;
    }
  })
  .controller('TableCtrl', function($scope, $log, $http) {
    $scope.game = {};
    $scope.picks = [];
    $scope.picksTotal = [];

    $scope.loadPicks = function() {
      $log.debug('load game and picks: ' + GAME_ID);

      $http.get('/game/' + GAME_ID).then(function(response) {
        $log.debug('loaded game ' + response.status);
        $scope.game = response.data;

        $http.get('/picks/' + GAME_ID).then(function(response) {
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
      });
    }
  })
  .controller('SelectionsCtrl', function($scope, $log, $http) {
    $scope.game = {};
    $scope.selections = []

    $scope.loadSelections = function() {
      $log.debug('load game and selections: ' + GAME_ID);

      $http.get('/game/' + GAME_ID).then(function(response) {
        $log.debug('loaded game ' + response.status);
        $scope.game = response.data;

        $http.get('/selections/' + GAME_ID).then(function(response) {
          $log.debug('loaded selections ' + response.status);
          $scope.selections = response.data;
        });
      });
    }
  })
  .controller('NavCtrl', function($scope, $location) {
    $scope.isActive = function(path) {
      return $location.path() == path;
    }
  })
  .controller('AboutCtrl', function($scope) {

  });