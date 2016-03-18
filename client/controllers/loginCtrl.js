'use strict';

var loginCtrl = angular.module('loginCtrl', []);

loginCtrl.controller('loginCtrl', ['$scope', '$rootScope', '$http', 'messagesService', 'AuthService', function ($scope, $rootScope, $http, messagesService, AuthService) {

    $scope.messages = messagesService.messages; 

    $scope.user = {};
    $scope.newUser = {};
    $scope.isLogin = true;
    $scope.buttonText = $scope.messages["register"];

    $scope.toggleLogin = function() {
        if($scope.isLogin) {
            $scope.isLogin = false;
            $scope.buttonText = $scope.messages["login"];
        }
        else {
            $scope.isLogin = true;
            $scope.buttonText = $scope.messages["register"];
        }
    };

    $scope.canSubmit = function() {
        if($scope.isLogin) {
            if($scope.user.username !== undefined && $scope.user.password !== undefined &&
                $scope.user.username !== '' && $scope.user.password !== '') {
                return true;
            }
            else return false;
        }
        else {
            if(!$scope.checkMatch() && $scope.newUser.username !== undefined && $scope.newUser.password !== undefined &&
                $scope.newUser.username !== '' && $scope.newUser.password !== '') {
                return true;
            }                
            else {
                return false;
            }
        }
    };  

    $scope.checkMatch = function() {
        return $scope.newUser.password !== $scope.newUser.repeatPassword;
    };
    
    $scope.login = function () {

      // initial values
      $scope.error = false;
      $scope.disabled = true;

      // call login from service
      AuthService.login($scope.user.username, $scope.user.password)
        // handle success
        .then(function () {
          $location.path('/secure');
          $scope.disabled = false;
          $scope.loginForm = {};
        })
        // handle error
        .catch(function () {
          $scope.error = true;
          $scope.errorMessage = "Invalid username and/or password";
          $scope.disabled = false;
          $scope.loginForm = {};
        });

    };
}]);





loginCtrl.controller('rootCtrl', ['$scope', '$http', function ($scope, $http) {
    
    $scope.user = {};
    var request = $http.get('/status');

    request.then(function(response) {
        console.log(response);
        if(response.data.status === true) {
            $scope.isLoggedIn = true;
            $scope.user = response.data.user;
        }
        else {
            $scope.isLoggedIn = false;
            $scope.user.lastName = "onbekende";
        }
    });

    $scope.login = function(username, password) {

        var request = $http.post('/login', {username: username, password: password});

        return request.then(function(response) {
            if(response.data.error === 1) {
                //logger.error($scope.$$childTail.messages[response.data.message]);    
            }
            else {
                $scope.isLoggedIn = true;
                window.location.href = '#/secure';
                $scope.username = response.data.user;
                //logger.success("Welcome " + response.data.user + "!");
            }
        });        
    };    

    $scope.logout = function () {
        $http.post('/logout').
        success(function(data) {
            $scope.isLoggedIn = false;
            window.location.href = '/';
        });
    }    
}]);
