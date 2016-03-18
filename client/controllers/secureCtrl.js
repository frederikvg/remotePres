'use strict';

var secureCtrl = angular.module('secureCtrl', []);

secureCtrl.controller('secureCtrl', ['$scope', function ($scope) {

    $scope.message = "Je zit nu op de beveiligde pagina";
}]);