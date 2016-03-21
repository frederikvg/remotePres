'use strict';

var slideCtrl = angular.module('slideCtrl', []);

slideCtrl.controller('slideCtrl', ['$scope', 'addPres', '$http', function ($scope, addPres, $http) {
    
    var request = $http.get('/status');
    
    request.then(function (response) {
        if (response.data.status === true) {
            $scope.user = response.data.user;
        }
    });
    
    var load = function () {
        addPres.getpres($scope.user._id).success(function (data) {
            $scope.presentaties = data.presentaties;
        });
    };

    load();
    
    $scope.savePres = function () {
        addPres.createPres($scope.user._id, $scope.pres)
            .success(function () {
                load();
            });
    };
    
    $scope.saveSlide = function () {
        if ($scope.pres.slideTitle !== null && $scope.pres.slideContent !== null) {
            addPres.createSlide($scope.user._id, $scope.pres.presTitle, $scope.pres)
                .success(function () {
                    load();
                });
        }
    };
}]);