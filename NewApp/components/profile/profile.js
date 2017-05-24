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
	$scope.all_subjects = [];
      $scope.user = {
          username: null,
          password: null,
      };
	
      if (ParseSvc.isRegistered) {
          $rootScope.username = ParseSvc.getUsername();
      }
      // scope.login = function () {
//           ParseSvc.login($scope.user, loginCallback)
//       }
      if (ParseSvc.getUsername() !== null) {
          $scope.user.username = ParseSvc.getUsername();

      }
	  
	  $scope.results = [];
	  $scope.setEval = function (objectId) {
        console.log(objectId);
        //ParseSvc.getEval(objectId, $scope.printForm);
        ParseSvc.currentEval = objectId;
        $location.path('/show-eval');
		};
	  $scope.searchCallBack = function (results) {
        for (i = 0; i < results.length; ++i) {
            var subject_names = "";
			if(results[i].has("Subjects")){
				$.each(results[i].get("Subjects"),function(index,value){
					for (t = 0; t < $scope.all_subjects.length; ++t){
						if(value == $scope.all_subjects[t].id){
							if(index==0){
								subject_names=$scope.all_subjects[t].get("subjectName");
							}
							else{
								subject_names= subject_names+ ", "+ $scope.all_subjects[t].get("subjectName");
							}
							break;
						}
					}
					
					
				});
			}
			
			$scope.results.push({
                title: String(results[i].get("Title")),
                //    LearningGoals: String(results[i].get("LearningGoals")),
                username: results[i].get("Author").get("username"),
                score: results[i].get("TotalScore"),
                individual_scores: results[i].get("IndividualScores"),
                subjects: subject_names,
                gradelevel: results[i].get("GradeLevel"),
                engagetotal: results[i].get("Engage"),
                enhancetotal: results[i].get("Enhance"),
                extendtotal: results[i].get("Extend"),
                objectId: results[i].id
            });
        }
        $scope.$apply();
        //console.log($scope.results);
		};
		$scope.setSubjects = function (parseSubjects) {
			$scope.all_subjects = parseSubjects;
		};
		ParseSvc.getSubjects($scope.setSubjects);
        var query = ParseSvc.initEvalQuery();
        query = ParseSvc.searchAuthor(query, ParseSvc.getUsername());
        ParseSvc.executeQuery(query, $scope.searchCallBack);
		
	  
}]);
