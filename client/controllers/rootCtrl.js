'use strict';

var rootCtrl = angular.module('rootCtrl', []);

rootCtrl.controller('rootCtrl', ['$scope', '$http', '$location', '$interval', '$timeout', function ($scope, $http, $location, $interval, $timeout) {
    
    $scope.user = {};
    var request = $http.get('/status');
    
    request.then(function (response) {
        if (response.data.status === true) {
            $scope.isLoggedIn = true;
            $scope.user = response.data.user;
        } else {
            $scope.isLoggedIn = false;
            $scope.user.lastName = "onbekende";
        }
    });

    $scope.login = function (username, password) {
        window.location.href = '/#/login';
    };

    $scope.logout = function () {
        window.location.href = '/signout';
    };
    
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
    
    $scope.presCode = function () {
        if ($scope.code) {
            localStorage.setItem('presCode', $scope.code);
            window.location.href = '/reveal';
        }
    };
}]);