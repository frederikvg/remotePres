'use strict';

var remoteCtrl = angular.module('remoteCtrl', []);

remoteCtrl.controller('remoteCtrl', ['socket', '$scope', '$timeout', '$interval', function (socket, $scope, $timeout, $interval) {

    Reveal.initialize({
        history: true
    });

    $scope.blurred = true;
    var key;
    var animationTimeout;

    $scope.loginCheck = function () {

        key = $scope.login;
        console.log('pass: ' + key);
        if (key.length) {
            socket.emit('load', {
                key: key
            });
        }
    };

    socket.on('access', function (data) {
        if (data.access === "granted") {
            $scope.blurred = false;
            $scope.loginForm = true;
            var ignore = false;

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
            $scope.wrongPass = 'denied animation';
            $timeout(function () {
                $scope.wrongPass = 'denied'
            }, 1000);
        }
    });
}]);