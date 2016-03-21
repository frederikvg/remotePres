'use strict';

var loginCtrl = angular.module('loginCtrl', []);

loginCtrl.controller('loginCtrl', ['$scope', function ($scope) {

    $scope.user = {};
    $scope.newUser = {};
    $scope.isLogin = true;
    $scope.buttonText = 'Registreer';

    $scope.toggleLogin = function () {
        if ($scope.isLogin) {
            $scope.isLogin = false;
            $scope.buttonText = 'Log in';
        } else {
            $scope.isLogin = true;
            $scope.buttonText = 'Registreer';
        }
    };

    $scope.canSubmit = function () {
        if ($scope.isLogin) {
            if ($scope.user.username !== undefined && $scope.user.password !== undefined && $scope.user.username !== '' && $scope.user.password !== '') {
                return true;
            } else {
                return false;
            }
        } else {
            if (!$scope.checkMatch() && $scope.newUser.username !== undefined && $scope.newUser.password !== undefined && $scope.newUser.username !== '' && $scope.newUser.password !== '') {
                return true;
            } else {
                return false;
            }
        }
    };

    $scope.checkMatch = function () {
        return $scope.newUser.password !== $scope.newUser.repeatPassword;
    };
}]);