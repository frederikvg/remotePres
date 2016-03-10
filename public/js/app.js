'use strict';

var remotePres = angular.module('remotePres', ['remoteCtrl', 'remoteService', 'ngAnimate', 'ngRoute']);

remotePres.config(
    ['$routeProvider', function ($routeProvider) {
        $routeProvider
            .when('/', {
                templateUrl: 'views/main.html'
            })
            .when('/main', {
                templateUrl: 'views/main.html'
            })
            .otherwise({
                redirectTo: '/'
            });
    }]
);

remotePres.directive('fbLogin', function () {
    return {
        restrict: 'A',
        transclude: true,
        templateUrl: 'views/login.html'
    };
});