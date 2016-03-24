'use strict';

var slideCtrl = angular.module('slideCtrl', []);

slideCtrl.controller('slideCtrl', ['$scope', 'routes', '$http', function ($scope, routes, $http) {

    $scope.pres = {};
    var request = $http.get('/status'),
        user = $scope.user,
        months = ['januari', 'februari', 'maart', 'april', 'mei', 'juni', 'juli', 'augustus', 'september', 'oktober', 'november', 'december'];

    request.then(function (response) {
        if (response.data.status === true) {
            $scope.user = response.data.user;
            $scope.pres.maker = response.data.user.firstName + ' ' + response.data.user.lastName;
        }
    });

    var loadPres = function () {
        routes.getpres($scope.user._id).success(function (data) {
            $scope.presentaties = data.presentaties;
            for (var i = 0; i < $scope.presentaties.length; i++) {
                var time = new Date($scope.presentaties[i].created);
                $scope.presentaties[i].created =
                    time.getDate() + ' ' +
                    months[time.getMonth()] + ' ' +
                    time.getFullYear() + ', ' +
                    time.getHours() + ':' +
                    pad(time.getMinutes());
            }
        });
    };
    loadPres();

    var loadSlides = function (presTitle) {
        routes.getslides(presTitle).success(function (data) {
            $scope.slides = data;
            console.log(data);
            var time = new Date(data.created);
                $scope.slides.created =
                    time.getDate() + ' ' +
                    months[time.getMonth()] + ' ' +
                    time.getFullYear() + ', ' +
                    time.getHours() + ':' +
                    pad(time.getMinutes());
                console.log($scope.slides);
        });
    };
    
    function pad(n) {
        return (n < 10) ? ("0" + n) : n;
    };

    $scope.savePres = function () {
        $scope.pres.presTitle = $scope.pres.presTitle.replace(/ /g, '').toLowerCase();
        routes.createPres($scope.user._id, $scope.pres)
            .success(function () {
                loadPres();
            });
    };

    $scope.saveSlide = function () {
        $scope.pres.presTitle = $scope.slides.presentatie;
        console.log($scope.pres);
        routes.createSlide($scope.user._id, $scope.pres.presTitle, $scope.pres)
            .success(function () {
                loadSlides($scope.pres.presTitle);
            });
    };

    $scope.canSubmit = function () {
        if ($scope.pres.presTitle !== undefined && $scope.pres.presTitle !== '') {
            return true;
        } else {
            return false;
        }
    };

    $scope.openPres = function (presTitle) {
        $scope.addPres = true;
        loadSlides(presTitle);
    }
}]);