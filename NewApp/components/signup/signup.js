var signup = angular.module('Signup', []);

signup.controller('SignupController', ['$location', '$scope', '$rootScope', 'ParseSvc', function ($location, $scope, $rootScope, ParseSvc) {
    $scope.show_error = false;
    $scope.error_msg;

    var signupCallback = function (success, message) {
        if(success) {
            $rootScope.$broadcast('new username', ParseSvc.getUsername());
            $location.path('/');
        } else {
            $scope.show_error = true;
            $scope.error_msg = 'ERROR: ' + message;
        }
        $scope.$apply();
    }

    $scope.user = {
        username: null,
        password: null,
        password2: null,
        email: null,
        name: null
    };
    if (ParseSvc.isRegistered) {
        $rootScope.username = ParseSvc.getUsername();
    }
    $scope.signUp = function () {
        if ($scope.user.password !== $scope.user.password2) {
            $scope.show_error = true;
            $scope.error_msg = 'ERROR: Passwords do not match';
            return;
        }
        ParseSvc.signUp($scope.user, signupCallback);
    }

}])
