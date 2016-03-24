'use strict';

var remoteService = angular.module('remoteService', []);

remoteService.factory('AuthService', ['$http', function ($http) {

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

remoteService.factory('routes', ['$http', function ($http) {

    return {
        getpres: function (userId) {
            return $http.get('/findpres/' + userId);
        },
        getslides: function (presTitle) {
            return $http.get('/pres/' + presTitle);
        },
        createPres: function (userId, newPres) {
            return $http.post('/addpres/' + userId, newPres);
        },
        createSlide: function (userId, presName, newSlide) {
            return $http.post('/addslide/' + userId + '/' + presName, newSlide);
        },
        editprofile: function (userId, userEdit) {
            return $http.post('/editprofile/' + userId, userEdit);    
        },
        delete: function (id) {
            return $http.delete('/delete/' + id);
        }
    };
    
}]);
