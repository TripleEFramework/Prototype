var reset = angular.module('ResetPassword', []);

reset.controller('ResetPasswordController', ['$scope', 'ParseSvc', function ($scope, ParseSvc) {
    $scope.email = null;
    $scope.resetPassword = function () {
        ParseSvc.resetPassword($scope.email)
    }

}])
