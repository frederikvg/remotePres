'use strict';

var slideCtrl = angular.module('slideCtrl', []);

slideCtrl.controller('slideCtrl', ['$scope', 'addPres', '$http', function ($scope, addPres, $http) {

    $scope.pres = {};
    var request = $http.get('/status'),
        user = $scope.user,
        months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

    request.then(function (response) {
        if (response.data.status === true) {
            $scope.user = response.data.user;
        }
    });

    var load = function () {
        addPres.getpres($scope.user._id).success(function (data) {
            $scope.presentaties = data.presentaties;
            for (var i = 0; i < $scope.presentaties.length; i++) {
                var time = new Date($scope.presentaties[i].created);
                $scope.presentaties[i].created =
                    time.getDate() + ' ' +
                    months[time.getMonth()] + ' ' +
                    time.getFullYear() + ', ' +
                    time.getHours() + ':' +
                    time.getMinutes();
            }
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

    $scope.canSubmit = function () {
        if ($scope.pres.presTitle !== undefined && $scope.pres.presTitle !== '') {
            return true;
        } else {
            return false;
        }
    };
}]);