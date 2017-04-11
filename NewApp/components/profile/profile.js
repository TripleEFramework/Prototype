var profile = angular.module('Profile', []);

profile.controller('ProfileController',
  ['$scope', '$rootScope', 'ParseSvc', function ($scope, $rootScope, ParseSvc) {
      //callback function to set global username on login sucess
      //This is neccessary because JavaScript runs sychronously
      //callback functions are one way to preserve asynchronicity
      var profileCallback = function () {
          $rootScope.$broadcast('new username', ParseSvc.getUsername());
          window.location.reload();
      }

      $scope.user = {
          username: null,
          password: null,
      };

      if (ParseSvc.isRegistered) {
          $rootScope.username = ParseSvc.getUsername();
      }
      $// scope.login = function () {
//           ParseSvc.login($scope.user, loginCallback)
//       }
      if (ParseSvc.getUsername() !== null) {
          $scope.user.username = ParseSvc.getUsername();

      }
}]);
