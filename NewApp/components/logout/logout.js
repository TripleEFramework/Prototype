var logout = angular.module('Logout', []);

logout.controller('LogoutController', ['$location', '$scope', '$rootScope', 'ParseSvc', function ($location, $scope, $rootScope, ParseSvc) {
    var logoutCallback = function () {
        $rootScope.$broadcast('new username', "");
        $location.path('/login');
    }
    $scope.logout = function () {
        ParseSvc.logout(logoutCallback);
    }

}]);
