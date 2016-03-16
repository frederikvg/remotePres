'use strict';

var loginCtrl = angular.module('loginCtrl', []);

loginCtrl.controller('loginCtrl', ['$scope', '$rootScope', '$http', 'messagesService', function ($scope, $rootScope, $http, messagesService) {

    $scope.messages = messagesService.messages; 

    $scope.user = {};
    $scope.newUser = {};
    $scope.isLogin = true;
    $scope.buttonText = $scope.messages["register"];

    $scope.toggleLogin = function() {
        if($scope.isLogin) {
            $scope.isLogin = false;
            $scope.buttonText = $scope.messages["login"];
        }
        else {
            $scope.isLogin = true;
            $scope.buttonText = $scope.messages["register"];
        }
    }

    $scope.canSubmit = function() {
        if($scope.isLogin) {
            if($scope.user.email !== undefined && $scope.user.password !== undefined &&
                $scope.user.email !== '' && $scope.user.password !== '') {
                return true;
            }
            else return false;
        }
        else {
            if(!$scope.checkMatch() && $scope.newUser.email !== undefined && $scope.newUser.password !== undefined &&
                $scope.newUser.email !== '' && $scope.newUser.password !== '') {
                return true;
            }                
            else {
                return false;
            }
        }
    }

    $scope.createUser = function(email, password, role) {

        var request = $http.post('/register', {email: email, password: password, role: role});

        return request.then(function(response) {
//            if(response.data.error === 1) {
//                logger.error(response.data.user + $scope.messages["alreadyRegistered"]);
//            }
//            else {
//                logger.success(response.data.user + $scope.messages["registerSuccess"]);
//            }
        });
    };    

    $scope.checkMatch = function() {
        return $scope.newUser.password !== $scope.newUser.repeatPassword;
    } 
}]);

loginCtrl.controller('rootCtrl', ['$scope', '$http', function ($scope, $http) {
    
    var request = $http.get('/getUserDetails');

    request.then(function(response) {
        console.log(response);
        if(response.data.loggedIn === 1) {
            $scope.isLoggedIn = true;
            $scope.email = response.data.user.email;
        }
        else {
            $scope.isLoggedIn = false;
            $scope.email = "onbekende";
        }
    });

    $scope.login = function(email, password) {

        var request = $http.post('/login', {email: email, password: password});

        return request.then(function(response) {
            if(response.data.error === 1) {
                //logger.error($scope.$$childTail.messages[response.data.message]);    
            }
            else {
                $scope.isLoggedIn = true;
                window.location.href = '#/secure';
                $scope.email = response.data.user;
                console.log(response.data);
                //logger.success("Welcome " + response.data.user + "!");
            }
        });        
    };    

    $scope.logout = function () {
        $http.post('/logout').
        success(function(data) {
            $scope.isLoggedIn = false;
            window.location.href = '/';
        });
    }    
}]);
