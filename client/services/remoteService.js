'use strict';

var remoteService = angular.module('remoteService', []);

remoteService.factory('AuthService', ['$q', '$timeout', '$http', function ($q, $timeout, $http) {

    var user = null;

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

    function getUserStatus() {
        $http.get('/status')
            .success(function (data) {
                if (data.status) {
                    user = true;
                } else {
                    user = false;
                }
            })
            .error(function (data) {
                user = false;
            });
    };
}]);

remoteService.factory('addPres', ['$http', function ($http) {

    return {
        find: function (titel) {
            return $http.get('/pres/' + titel);
        },
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
    };
    
}]);
