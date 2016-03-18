'use strict';

var remoteCtrl = angular.module('remoteCtrl', []);

remoteCtrl.controller('remoteCtrl', ['socket', '$scope', '$timeout', '$interval', 'Passport', function (socket, $scope, $timeout, $interval, Passport) {

    $scope.blurred = true;
    $scope.hideForm = false;
    $scope.hideCode = true;
    $scope.user = '';
    var key;

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
        if ($scope.loginForm.$valid) {
            document.loginForm.action = "/login";
            document.loginForm.submit();
        }
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

    $scope.addUser = function () {
        if ($scope.user!=null) {
            console.log($scope.user);
            Passport.create($scope.user)
                .success(function () {
                    // load();
                });
        } else {
            $scope.checked = true;
        }
    };

    $scope.delete = function (id) {
        var li = document.getElementById(id);
        li.className = 'todo animated fadeOut';
        setTimeout(function() {
            Passport.delete(id)
            .success(function (data) {
                load();
            });
        }, 600);
    };

    socket.on('access', function (data) {
        if (data.access === "granted") {
            $scope.blurred = true;
            $scope.hideForm = true;
            $scope.hideCode = false;
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
            $scope.wrongCode = 'No presentation found with this code';
            $timeout(function () {
                $scope.wrongCode = ''
            }, 3000);
        }
    });
}]);