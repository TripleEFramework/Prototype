var signup = angular.module('Signup', []);

signup.controller('SignupController', ['$scope', '$rootScope', 'ParseSvc', function ($scope, $rootScope, ParseSvc) {
    var signupCallback = function () {
        $rootScope.$broadcast('new username', ParseSvc.getUsername());
        window.location.reload();
    }

    $scope.error = false;
    $scope.error_msg;

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
            $scope.error = true;
            $scope.error_msg = 'Passwords do not match';
            return;
        }
        ParseSvc.signUp($scope.user, signupCallback);
    }

}])
