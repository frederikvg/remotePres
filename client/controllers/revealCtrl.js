'use strict';

var revealCtrl = angular.module('revealCtrl', []);

revealCtrl.controller('revealCtrl', ['$scope', '$timeout', '$interval', '$http', 'socket', function ($scope, $timeout, $interval, $http, socket) {

    var presTitle = localStorage.getItem('presCode'),
        request = $http.get('/pres/' + presTitle);
        console.log(presTitle);
    
    request.then(function (response) {
        if (response) {
            $scope.data = response.data;
        }
    });
    
    $timeout(function () {
        Reveal.initialize({
            history: true
        });
    }, 1000);
    
    socket.on('access', function (data) {
        var ignore = false;
        window.location.href = 'reveal#';

        $(window).on('hashchange', function () {
            if (ignore) {
                return;
            }
            
            var hash = window.location.hash;

            socket.emit('slide-changed', {
                hash: hash
            });
        });

        socket.on('navigate', function (data) {
            window.location.hash = data.hash;
            ignore = true;

            $interval(function () {
                ignore = false;
            }, 100);
        });
    });
}]);