'use strict';

var rootCtrl = angular.module('rootCtrl', []);

rootCtrl.controller('rootCtrl', ['$scope', '$http', '$location', '$interval', '$timeout', 'socket', function ($scope, $http, $location, $interval, $timeout, socket) {
    
    $scope.user = {};
    var key;
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
        window.location.href = '/#/login';
    };    

    $scope.logout = function () {
        window.location.href = '/signout';
    };
    
    $scope.isActive = function (viewLocation) { 
        return viewLocation === $location.path();
    };

}]);