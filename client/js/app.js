'use strict';

var revealPres = angular.module('revealPres', ['revealCtrl', 'revealService']);
var remotePres = angular.module('remotePres', ['rootCtrl', 'loginCtrl', 'slideCtrl', 'remoteService', 'ngRoute']);

remotePres.config(['$routeProvider', function ($routeProvider) {
    $routeProvider
        .when('/home', {
            templateUrl: '/views/home.html',
            access: {restricted: false}
        })
        .when('/login', {
            templateUrl: '/views/enter.html',
            access: {restricted: false}
        })
        .when('/pres', {
            templateUrl: '/views/pres.html',
            access: {restricted: true}
        })
        .when('/user', {
            templateUrl: '/views/user.html',
            access: {restricted: true}
        })
        .otherwise({
            redirectTo: '/home'
        });
}]);
    
remotePres.run(function ($rootScope, $location, $route, AuthService) {
    $rootScope.$on('$routeChangeStart',
        function (event, next, current) {
            AuthService.getUserStatus();
            if (next.$$route.access.restricted && !AuthService.isLoggedIn()) {
                $location.path('/login');
                $route.reload();
            }
        });
});

remotePres.directive('fbTopnav', function () {
    return {
        restrict: 'A',
        transclude: true,
        templateUrl: 'views/topnav.html'
    };
});

remotePres.directive('fbFooter', function () {
    return {
        restrict: 'A',
        transclude: true,
        templateUrl: 'views/footer.html'
    };
});