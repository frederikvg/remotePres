'use strict';

var rootCtrl = angular.module('rootCtrl', []);

rootCtrl.controller('rootCtrl', ['$scope', '$http', '$location', '$interval', '$timeout', 'routes', 'ngDialog',
    function ($scope, $http, $location, $interval, $timeout, routes, ngDialog) {
    
    $scope.user = {};
    var request = $http.get('/status');
    
    request.then(function (response) {
        if (response.data.status === true) {
            $scope.isLoggedIn = true;
            $scope.user = response.data.user;
        } else {
            $scope.isLoggedIn = false;
            $scope.user.lastName = 'onbekende';
        }
    });

    $scope.login = function (username, password) {
        window.location.href = '/#/login';
    };

    $scope.logout = function () {
        window.location.href = '/signout';
    };
    
    $scope.isActive = function (viewLocation) {
        return viewLocation === $location.path();
    };
    
    $scope.presCode = function () {
        if ($scope.code) {
            $scope.code = $scope.code.replace(/ /g, '').toLowerCase();
            var pres = $http.get('/pres/' + $scope.code);
            
            pres.then(function (response) {
                if (response) {
                    localStorage.setItem('presCode', $scope.code);
                    window.location.href = '/reveal';
                }
            });
        }
    };
        
    $scope.submitEdit = function () {
        routes.editprofile($scope.user._id, $scope.user)
            .success(function (user) {
            });
        window.location.href = '/#/user';
    };

    $scope.canSubmit = function () {
        if (!$scope.checkMatch() && $scope.user.username !== undefined && $scope.user.password2 !== undefined && $scope.user.username !== '' && $scope.user.password2 !== '') {
            return true;
        } else {
            return false;
        }
    };

    $scope.checkMatch = function () {
        return $scope.user.password2 !== $scope.user.repeatPassword;
    };

    $scope.deletePopup = function () {
        ngDialog.open({ template: 'views/delete.html', className: 'ngdialog-theme-default', controller: 'rootCtrl' });
    };
        
    $scope.deleteUser = function () {
        routes.delete($scope.user._id)
            .success(function (user) {
                window.location.href = '/signout';
            });
    };
}]);