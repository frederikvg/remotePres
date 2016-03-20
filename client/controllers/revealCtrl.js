'use strict';

var revealCtrl = angular.module('revealCtrl', []);

revealCtrl.controller('revealCtrl', ['$scope', '$timeout', '$interval', 'socket', function ($scope, $timeout, $interval, socket) {

    $scope.slides = [
        { image: "../img/1.jpg", video: "", title: "Title Text", content: "Lorem Ipsum is slechts een proeftekst PageMaker die versies van Lorem Ipsum bevatten.",  background:"../img/3.jpg"},
        { image: "../img/5.jpg", video: "", title: "...no color here? Why??", content: "", background: "../img/2.jpg"}
    ];
    
    $timeout(function(){
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

        socket.emit('gettitel');
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