// Lastly, define your "main" module and inject all other modules as dependencies
var app = angular.module('App',
[
    'ngRoute',
    'Parse',
    'Login',
    'Search',
    'Signup',
    'SubmitEval',
    'ResetPassword',
    'Logout'
]);

app.controller('Base', ['$scope', '$rootScope', 'ParseSvc', function ($scope, $rootScope, ParseSvc) {
    //calls appOpened once on controller's instantiation
    var init = function () {
        ParseSvc.appOpened();
    };
    init();
    //Keep user logged in if they still have a session
    if (ParseSvc.getUsername() !== null) {
        $rootScope.username = ParseSvc.getUsername();
    }
    $scope.username = $rootScope.username;
    $rootScope.$on('new username', function (event, data) {
        $scope.username = data;
        if ($scope.username !== "") {
            $scope.$apply();
        }
    });

    $scope.isUser = function () {
        if ($scope.username === "" || $scope.username === undefined) {
            return false;
        }
        else {
            return true;
        }
    }
}]);
