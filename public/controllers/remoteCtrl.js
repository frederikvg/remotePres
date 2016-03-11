'use strict';

var remoteCtrl = angular.module('remoteCtrl', []);

remoteCtrl.controller('remoteCtrl', ['socket', '$scope', '$timeout', '$interval', function (socket, $scope, $timeout, $interval) {

    $scope.blurred = true;
    var key;
    var animationTimeout;

    $scope.slides = [
        { image: "img/1.jpg", video: "", title: "Title Text", content: "Lorem Ipsum is slechts een proeftekst PageMaker die versies van Lorem Ipsum bevatten.",  background:"img/3.jpg"},
        { image: "", video: "img/vid.mp4", title: "...no color here? Why??", content: "", background: "img/2.jpg"}
    ];

    $timeout(function () {
        Reveal.initialize({
            loop: true,
            slideNumber: false,
            progress: true,
            overview: true,
            autoSlide: 0,
            history: true,
            touch: true,
            hideAddressBar: true,
        });
    }, 1000);


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