var logout = angular.module('Logout', []);

logout.controller('LogoutController', ['$scope', '$rootScope', 'ParseSvc', function ($scope, $rootScope, ParseSvc) {
    var logoutCallback = function () {
        $rootScope.$broadcast('new username', "");
    }
    $scope.logout = function () {
        ParseSvc.logout(logoutCallback);
    }

}]);
