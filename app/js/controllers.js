'use strict';

/* Controllers */
angular.module('myApp.controllers', [])
  .controller('SelectionsCtrl', function($scope, $location, Selection, Pick) {
    $scope.selections = null;
    $scope.pots = null;
    $scope.potsel = [];

    $scope.loadSelections = function() {
      $scope.selections = Selection.query({
        gameId: '53959190e4b0a2f0b57062b8'
      }, function() {
        $scope.pots = _.groupBy($scope.selections, 'pot');
      });
    }

    $scope.submitSelections = function() {
      var picks = new Pick({
        name: $scope.name,
        game: '53959190e4b0a2f0b57062b8',
        selections: $scope.potsel
      });
      picks.$save();
    }
  })
  .controller('TableCtrl', function($scope, Pick) {
    $scope.picks = [];
    $scope.picksTotal = [];

    $scope.loadPicks = function() {
      $scope.picks = Pick.query({
        gameId: '53959190e4b0a2f0b57062b8'
      }, function() {
        $scope.picksTotal = _.map($scope.picks, function(pick) {
          return {
            "name": pick.name,
            "total": _.reduce(pick.selections, function(totalSoFar, selection) {
              return totalSoFar + selection.score;
            }, 0)
          }
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

  })
  .controller('UserCtrl', function($scope, User) {
    $scope.users = User.query();

    $scope.addUser = function() {
      var user = new User({
        name: $scope.newUser.name
      });
      user.$save();
      $scope.users.push(user);
      $scope.newUser = "";
    }
    $scope.showStory = function(user) {
      User.get({
        userId: user._id
      }, function(user) {
        $scope.showUser = user;
      });
    }
    $scope.hideStory = function() {
      $scope.showUser = null;
    }
    $scope.removeUser = function(user) {
      User.remove({
        userId: user._id
      }, function() {
        $scope.users = User.query();
        $scope.showUser = null;
      });
    }
    $scope.updateUser = function(user) {
      user.$save({
        userId: user._id
      });
      $scope.showUser = null;
    }
  });