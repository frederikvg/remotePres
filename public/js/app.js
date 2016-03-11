'use strict';

var remotePres = angular.module('remotePres', ['remoteCtrl', 'remoteService']);

remotePres.directive('fbLogin', function () {
    return {
        restrict: 'A',
        transclude: true,
        templateUrl: 'views/login.html'
    };
});