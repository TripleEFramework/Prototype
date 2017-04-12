// Lastly, define your "main" module and inject all other modules as dependencies
var app = angular.module('App',
[
    'ngRoute',
    'Parse',
    'Login',
    'Search',
    'Signup',
    'SubmitEval',
	'EditEval',
    'ShowEval',
    'ResetPassword',
    'Logout',
    'Profile'
]);

app.controller('Base', ['$location', '$scope', '$rootScope', 'ParseSvc', function ($location, $scope, $rootScope, ParseSvc) {
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

    var logoutCallback = function () {
        $rootScope.$broadcast('new username', "");
        $location.path('/');
    }

    $scope.logout = function () {
        ParseSvc.logout(logoutCallback);
    }
}]);
