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

remoteService.factory('AuthService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {

    // create user variable
    var user = null;

    // return available functions for use in the controllers
    return ({
        isLoggedIn: isLoggedIn,
        getUserStatus: getUserStatus
    });

    function isLoggedIn() {
        if (user) {
            return true;
        } else {
            return false;
        }
    };

    //Check for login
    function getUserStatus() {
        //Get request voor user status
        $http.get('/status')
                // handle success
                .success(function (data) {
                    if (data.status) {
                        user = true;
                        console.log(data);
                    } else {
                        user = false;
                    }
                })
                // handle error
                .error(function (data) {
                    user = false;
                });
    };
}]);

remoteService.factory('addPres', ['$http', function ($http) {

    return {
        get: function () {
            return $http.get('/slides');
        },
        createPres: function (newPres) {
            return $http.post('/addpres', newPres);
        },
        createSlide: function (presId, newSlide) {
            return $http.post('/addpres/' + presId, newSlide);
        },
        delete: function (id) {
            return $http.delete('/addslide/' + id);
        }
    }
    
}]);
