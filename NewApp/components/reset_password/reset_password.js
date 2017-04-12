var reset = angular.module('ResetPassword', []);

reset.controller('ResetPasswordController', ['$scope', 'ParseSvc', function ($scope, ParseSvc) {
    $scope.show_success = false;
    $scope.show_error = false;
    $scope.message;
    $scope.resetCallback = function (success, message) {
        if(success) {
            $scope.show_error = false;
            $scope.show_success = true;
            $scope.message = "Password reset link sent.";
        } else {
            $scope.show_error = true;
            $scope.show_success = false;
            $scope.message = "ERROR: " + message;
        }
        $scope.$apply();
    }

    $scope.email = null;
    $scope.resetPassword = function () {
        ParseSvc.resetPassword($scope.email, $scope.resetCallback)
    }

}])
