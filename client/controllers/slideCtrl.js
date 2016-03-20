'use strict';

var slideCtrl = angular.module('slideCtrl', []);

slideCtrl.controller('slideCtrl', ['$scope', 'addPres', '$http', function ($scope, addPres, $http) {

    $scope.slide = {};
    $scope.presentaties = {};
    
    var load = function () {
        addPres.get().success(function (data) {
            $scope.presentaties = data;
            console.log($scope.presentaties);
        });
    };

    load();
    
    $scope.savePres = function () {
        addPres.createPres($scope.pres)
            .success(function () {
                load();
                console.log('pres toegevoegd')
            });
    }
    
    $scope.saveSlide = function () {
        if ($scope.slide.slideTitle != null && $scope.slide.slideContent != null) {
            console.log($scope.slide);
            addPres.createSlide($scope.slide.presTitle, $scope.slide)
                .success(function () {
                    console.log('success');
                });
        } else {
            console.log('error saving slide');
        }
        load();
    };
}]);