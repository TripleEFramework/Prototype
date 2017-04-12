var submit = angular.module('SubmitEval', []);

submit.controller('SubmitEvalController', ['$location', '$scope', '$rootScope', 'ParseSvc', function ($location, $scope, $rootScope, ParseSvc) {
    $scope.error = false;
    $scope.error_msg;

    $scope.submitCallback = function (success, response) {
        if(success) {
            ParseSvc.currentEval = response;
            $location.path('/show-eval');
        } else {
            $scope.error = true;
            $scope.error_msg = "Failed to submit: " + response;
        }
    };

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

    $scope.setSubjects = function (parseSubjects) {
        $scope.subjects = parseSubjects;
        $scope.$apply();
    };
    ParseSvc.getSubjects($scope.setSubjects);

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
        ParseSvc.reviewForm($scope.EvalForm, $scope.submitCallback);
    }

}]);
