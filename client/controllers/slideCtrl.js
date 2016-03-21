'use strict';

var slideCtrl = angular.module('slideCtrl', []);

slideCtrl.controller('slideCtrl', ['$scope', 'addPres', '$http', function ($scope, addPres, $http) {

    var load = function () {
        addPres.get().success(function (data) {
            $scope.presentaties = data;
        });
    };

    load();
    
    $scope.savePres = function () {
        addPres.createPres($scope.pres)
            .success(function () {
                load();
            });
    };
    
    $scope.saveSlide = function () {
        if ($scope.pres.slideTitle !== null && $scope.pres.slideContent !== null) {
            addPres.createSlide($scope.pres.presTitle, $scope.pres)
                .success(function () {
                    load();
                });
        }
    };
}]);