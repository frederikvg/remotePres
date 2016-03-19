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
}]);