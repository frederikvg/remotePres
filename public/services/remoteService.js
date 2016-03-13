'use strict';

var remoteService = angular.module('remoteService', []);

remoteService.factory('socket', ['$rootScope', function ($rootScope) {
    var socket = io.connect();
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {  
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
}]);

remoteService.factory('Passport', ['$http', function ($http) {
    return {
        get: function () {
            return $http.get('/passports');
        },
        create: function (newUser) {
            console.log(newUser);
            return $http.post('/passport', newUser);
        },
        delete: function (id) {
            return $http.delete('passport/' + id);
        }
    }
}]);