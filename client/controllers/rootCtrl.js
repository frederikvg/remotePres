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
    
    $scope.loginCode = function () {
        key = $scope.code;
        console.log('pass: ' + key);
        if (key) {
            socket.emit('load', {
                key: key
            });
        } else {
            $scope.wrongCode = 'No code entered';
            $timeout(function () {
                $scope.wrongCode = ''
            }, 3000);
        }
    };
    
    socket.on('access', function (data) {
        if (data.access === "granted") {
            $scope.blurred = true;
            var ignore = false;
            window.location.href = '/#/reveal';

            $(window).on('hashchange', function () {
                if (ignore) {
                    return;
                }

                var hash = window.location.hash;

                socket.emit('slide-changed', {
                    hash: hash,
                    key: key
                });
            });

            socket.on('navigate', function (data) {
                window.location.hash = data.hash;
                ignore = true;

                $interval(function () {
                    ignore = false;
                }, 100);
            });
        } else {
            $scope.wrongCode = 'No presentation found with this code';
            $timeout(function () {
                $scope.wrongCode = ''
            }, 3000);
        }
    });
}]);