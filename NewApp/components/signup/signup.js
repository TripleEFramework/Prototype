var signup = angular.module('Signup', []);

signup.controller('SignupController', ['$scope', '$rootScope', 'ParseSvc', function ($scope, $rootScope, ParseSvc) {
    var signupCallback = function () {
        $rootScope.$broadcast('new username', ParseSvc.getUsername());
        window.location.reload();
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
            alert('Passwords don\'t match');
            return;
        }
        ParseSvc.signUp($scope.user, signupCallback);
    }

}])
