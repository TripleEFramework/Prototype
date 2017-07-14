var submit = angular.module('EditEval', []);

submit.controller('EditEvalController', ['$scope', '$rootScope', 'ParseSvc', function ($scope, $rootScope, ParseSvc) {
    $scope.EvalId=ParseSvc.currentEval; //"4lCfME29Wf" //"Mt2XM4cRtI";
	
	$scope.EvalForm = {
        Author: null,
        Title: null,
        LearningGoals: null,
        Subject: null,
        GradeLevel: null,
        Document: null,
        URL: null,
        Tags: null,
        TotalScore: 0,
        Engage: 0,
        Enhance: 0,
        Extend: 0,
		EngageComment: null,
		EnhanceComment: null,
		ExtendComment: null,
        IndividualScores: {
            engage1: null,
            engage2: null,
            engage3: null,
            enhance1: null,
            enhance2: null,
            enhance3: null,
            extend1: null,
            extend2: null,
            extend3: null
        }
    };
    $scope.gradeLevels = ['K-2', '3-5', 'K-5', '6-8', '9-12', '6-12', 'All Grades'];
	$scope.ensureApply= function(){
		$scope.$apply();
	};
	$scope.subjects=[];
	ParseSvc.getEval($scope.EvalId, $scope.printForm);
	$scope.printForm = function (result) {
		$scope.EvalForm.Author = result.get("Author");
		$scope.EvalForm.Title = result.get("Title");
		$scope.EvalForm.LearningGoals = result.get("LearningGoals");
		$scope.EvalForm.URL = result.get("URL");
		$scope.EvalForm.TotalScore = result.get("TotalScore");
		$scope.EvalForm.Tags = result.get("Tags");
		$scope.EvalForm.GradeLevel = result.get("GradeLevel");
		$scope.EvalForm.Engage = result.get("Engage");
		$scope.EvalForm.Enhance = result.get("Enhance");
		$scope.EvalForm.Extend = result.get("Extend");
		$scope.EvalForm.EngageComment = result.get("EngageComment");
		$scope.EvalForm.EnhanceComment = result.get("EnhanceComment");
		$scope.EvalForm.ExtendComment = result.get("ExtendComment");
		$scope.EvalForm.IndividualScores = result.get("IndividualScores");
		$scope.EvalForm.Subject = result.get("Subject");
        $("#lesson-title").prop("value",String(result.get("Title")));
	    $("#lesson-url").prop("value",String(result.get("URL")));
        $("#learning-goals").prop("value",String(result.get("LearningGoals")));
        $("#lesson-score").text(String(result.get("TotalScore")));
        //$("#lesson-author").text(String(result.get("Author").get("username")));
		$("#lesson-tags").prop("value",String(result.get("Tags")));
      //  $("#lesson-subject").prop("value",String(subjects.indexOf(result.get("Subject"))) );
		$scope.subject="-1";
		for(var i = 0; i<$scope.subjects.length; i+=1){
			if($scope.subjects[i].id == $scope.EvalForm.Subject.id){
				$scope.subject = String(i);
				break;
			}
		}
		//$scope.subject = String($scope.subjects.indexOf($scope.EvalForm.Subject));
        $("#lesson-grade").text(String(result.get("GradeLevel")));
        $("#engage-total").text(String(result.get("Engage")));
        $("#enhance-total").text(String(result.get("Enhance")));
        $("#extend-total").text(String(result.get("Extend")));
		$("#engage-comment").prop("value",String(result.get("EngageComment")));
		$("#enhance-comment").prop("value",String(result.get("EnhanceComment")));
		$("#extend-comment").prop("value",String(result.get("ExtendComment")));
        $("#engage1" + result.get("IndividualScores").engage1).attr("class", "radio ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched");
        $("#engage2" + result.get("IndividualScores").engage2).attr("class", "radio ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched");
        $("#engage3" + result.get("IndividualScores").engage3).attr("class", "radio ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched");
        $("#enhance1" + result.get("IndividualScores").enhance1).attr("class", "radio ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched");
        $("#enhance2" + result.get("IndividualScores").enhance2).attr("class", "radio ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched");
        $("#enhance3" + result.get("IndividualScores").enhance3).attr("class", "radio ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched");
        $("#extend1" + result.get("IndividualScores").extend1).attr("class", "radio ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched");
        $("#extend2" + result.get("IndividualScores").extend2).attr("class", "radio ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched");
        $("#extend3" + result.get("IndividualScores").extend3).attr("class", "radio ng-valid ng-not-empty ng-dirty ng-valid-parse ng-touched");
		
		$scope.ensureApply();
    };
	//ParseSvc.getEval($scope.EvalId, $scope.printForm);
	$scope.setSubjects = function (parseSubjects) {
        $scope.subjects = parseSubjects;
        $scope.$apply();
		ParseSvc.getEval($scope.EvalId, $scope.printForm);
    };
    ParseSvc.getSubjects($scope.setSubjects);
	//$scope.displayEval = function (objectId) {
	//	ParseSvc.getEval(objectId, $scope.printForm);
	//};
    $scope.reviewForm = function () {
        $scope.EvalForm.Title = $scope.title;
        $scope.EvalForm.LearningGoals = $scope.LearningGoals;
        $scope.EvalForm.Subject = $scope.subjects[$scope.subject];
        $scope.EvalForm.Document = $scope.lessonDocument;
        $scope.EvalForm.URL = $scope.LessonURL;
        $scope.EvalForm.GradeLevel = $scope.gradeLevel;
		$scope.EvalForm.EngageComment = $scope.EngageComment;
		$scope.EvalForm.EnhanceComment = $scope.EnhanceComment;
		$scope.EvalForm.ExtendComment = $scope.ExtendComment;
        if ($scope.tagString)
        {
            $scope.EvalForm.Tags = $scope.tagString.split(" ");
        }
        $scope.EvalForm.IndividualScores.engage1 = $scope.engage1;
        $scope.EvalForm.IndividualScores.engage2 = $scope.engage2;
        $scope.EvalForm.IndividualScores.engage3 = $scope.engage3;
        $scope.EvalForm.IndividualScores.enhance1 = $scope.enhance1;
        $scope.EvalForm.IndividualScores.enhance2 = $scope.enhance2;
        $scope.EvalForm.IndividualScores.enhance3 = $scope.enhance3;
        $scope.EvalForm.IndividualScores.extend1 = $scope.extend1;
        $scope.EvalForm.IndividualScores.extend2 = $scope.extend2;
        $scope.EvalForm.IndividualScores.extend3 = $scope.extend3;
        $scope.EvalForm.Engage = parseInt($scope.engage1, 10) + parseInt($scope.engage2, 10) + parseInt($scope.engage3, 10);
        $scope.EvalForm.Enhance = parseInt($scope.enhance1, 10) + parseInt($scope.enhance2, 10) + parseInt($scope.enhance3, 10);
        $scope.EvalForm.Extend = parseInt($scope.extend1, 10) + parseInt($scope.extend2, 10) + parseInt($scope.extend3, 10);
        //We need to rewrite this so it just adds scores normally
        var score = 0;
        $(".radio:checked").each(function () {
            score += parseInt($(this).val(), 10);
        });
        $scope.EvalForm.TotalScore = score;

        ParseSvc.reviewForm($scope.EvalForm);
    };
}]);

