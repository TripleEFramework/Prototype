var show = angular.module('ShowEval', []);

submit.controller('ShowEvalController', ['$scope', 'ParseSvc', function ($scope, ParseSvc) {
    $scope.all_subjects = [];
    $scope.setSubjects = function (parse_subjects) {
        $scope.all_subjects = parse_subjects;
    };
    //ParseSvc.getSubjects($scope.setSubjects);

	$scope.printForm = function (result) {
//        $("#search-results").attr("hidden", true);
        $("#chosen-individual-scores > tr > td > label").attr("hidden", true);
        $("#chosen-lesson-title").text(result.get("Title"));
	    $("#chosen-lesson-URL").text(result.get("URL"));
        $("#chosen-learning-goals").text(result.get("LearningGoals"));
        $("#chosen-lesson-score").text(String(result.get("TotalScore")));
        $("#chosen-lesson-author").text(String(result.get("AuthorName")));
        //Subject
        var subject_names = "";
        if(result.has("Subjects")){
            $.each(result.get("Subjects"),function(index,value){
                for (t = 0; t < $scope.all_subjects.length; ++t){
                    if(value == $scope.all_subjects[t].id){
                        if(index==0){
                            subject_names = $scope.all_subjects[t].get("subjectName");
                        }
                        else{
                            subject_names = subject_names+ ", "+ $scope.all_subjects[t].get("subjectName");
                        }
                        break;
                    }
                }
            });
        }
        $("#chosen-lesson-subject").text(subject_names);

        $("#chosen-lesson-grade").text(String(result.get("GradeLevels")));
        $("#chosen-engage-total").text(String(result.get("Engage")));
        $("#chosen-enhance-total").text(String(result.get("Enhance")));
        $("#chosen-extend-total").text(String(result.get("Extend")));
		$("#chosen-engage-comment").text(String(result.get("EngageComment")));
		$("#chosen-enhance-comment").text(String(result.get("EnhanceComment")));
		$("#chosen-extend-comment").text(String(result.get("ExtendComment")));
		$("#chosen-engage-comment").attr("hidden", false);
		$("#chosen-enhance-comment").attr("hidden", false);
		$("#chosen-extend-comment").attr("hidden", false);
        $("#engage1" + result.get("IndividualScores").engage1).attr("hidden", false);
        $("#engage2" + result.get("IndividualScores").engage2).attr("hidden", false);
        $("#engage3" + result.get("IndividualScores").engage3).attr("hidden", false);
        $("#enhance1" + result.get("IndividualScores").enhance1).attr("hidden", false);
        $("#enhance2" + result.get("IndividualScores").enhance2).attr("hidden", false);
        $("#enhance3" + result.get("IndividualScores").enhance3).attr("hidden", false);
        $("#extend1" + result.get("IndividualScores").extend1).attr("hidden", false);
        $("#extend2" + result.get("IndividualScores").extend2).attr("hidden", false);
        $("#extend3" + result.get("IndividualScores").extend3).attr("hidden", false);
		$scope.$apply();
    };
    displayEval = function (objectId) {
        console.log(objectId);
        ParseSvc.getEval(ParseSvc.currentEval, $scope.printForm);
    };

    
     $scope.setSubjects = function (parse_subjects) {
        $scope.all_subjects = parse_subjects;
        displayEval();
    };
    ParseSvc.getSubjects($scope.setSubjects);
}]);