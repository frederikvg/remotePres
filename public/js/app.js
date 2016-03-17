'use strict';

var remotePres = angular.module('remotePres', ['remoteCtrl', 'remoteService', 'ngRoute', 'secureCtrl', 'loginCtrl', 'messagesService']);

remotePres.config( 
	['$routeProvider', function($routeProvider) {
        $routeProvider.when('/login', {
            templateUrl: '/views/enter.html',
            controller: 'loginCtrl',
            access: {restricted: false}
        })
        .when('/unsecured', {
            templateUrl: '/views/unsecure.html',
            access: {restricted: false}
        })
        .when('/secure', {
            templateUrl: '/views/secure.html',
            controller: 'secureCtrl',
            access: {restricted: true}
        })
        .otherwise({
          redirectTo: '/login'
        }); 
	}
]);


remotePres.run(function ($rootScope, $location, $route, AuthService) {

    //Bij een route change
    $rootScope.$on('$routeChangeStart',
            function (event, next, current) {
                AuthService.getUserStatus();
                if (next.$$route.access.restricted && !AuthService.isLoggedIn()) {
                    console.log(next.$$route);
                    console.log('logged in: ' + !AuthService.isLoggedIn());
                    $location.path('/login');
                    $route.reload();
                }
            });
});

remotePres.directive('fbLogin', function () {
    return {
        restrict: 'A',
        transclude: true,
        templateUrl: 'views/login.html'
    };
});

remotePres.directive('fbCode', function () {
    return {
        restrict: 'A',
        transclude: true,
        templateUrl: 'views/code.html'
    };
});

remotePres.directive('slideable', function () {
    return {
        restrict:'C',
        compile: function (element, attr) {
            var contents = element.html();
            element.html('<div class="slideable_content" style="margin:0 !important; padding:0 !important" >' + contents + '</div>');

            return function postLink(scope, element, attrs) {
                attrs.duration = (!attrs.duration) ? '1s' : attrs.duration;
                attrs.easing = (!attrs.easing) ? 'ease-in-out' : attrs.easing;
                element.css({
                    'overflow': 'hidden',
                    'height': '0px',
                    'transitionProperty': 'height',
                    'transitionDuration': attrs.duration,
                    'transitionTimingFunction': attrs.easing
                });
            };
        }
    };
});

remotePres.directive('slideToggle', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var target = document.querySelector(attrs.slideToggle);
            attrs.expanded = false;
            element.bind('click', function() {
                var content = target.querySelector('.slideable_content');
                if(!attrs.expanded) {
                    content.style.border = '1px solid rgba(0,0,0,0)';
                    var y = content.clientHeight;
                    content.style.border = 0;
                    target.style.height = y + 'px';
                } else {
                    target.style.height = '0px';
                }
                attrs.expanded = !attrs.expanded;
            });
        }
    }
});