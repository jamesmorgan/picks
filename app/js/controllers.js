'use strict';

/* Controllers */
angular.module('myApp.controllers', [])
  .controller('SelectionsCtrl', function($scope, Selection) {
    $scope.selections = null;
    $scope.pots = null;

    $scope.loadSelections = function() {
      $scope.selections = Selection.query({
        gameId: '53959190e4b0a2f0b57062b8'
      }, function() {
          $scope.pots = _.groupBy($scope.selections, 'pot');
      });
    }

    $scope.submitSelections = function() {
      
    }
  })
  .controller('AboutCtrl', function($scope) {

  })
  .controller('NavCtrl', function($scope, $location) {
    // this toggles the 'active' class on/off in the navbar
    $scope.isActive = function(path) {
      var current = $location.path();
      return path === current ? 'active' : '';
    };
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