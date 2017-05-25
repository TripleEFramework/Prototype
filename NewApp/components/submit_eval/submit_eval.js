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
        $scope.$apply();
    };

    $scope.EvalForm = {
        Author: null,
        Title: null,
        LearningGoals: null,
        Subjects: null,
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
        $scope.all_subjects = parseSubjects;
		
		//subjects dropdown checkbox stuff
		var inHTML = "";

		$.each($scope.all_subjects, function(index, value){
			var newItem = '<li><a class="small" data-value="'+$scope.all_subjects.indexOf(value)+'" tabIndex="-1"><input type="checkbox"/>&nbsp;'+value.get("subjectName")+'</a></li>'
			inHTML += newItem;  
		});

		$("ul#dynamicSubjectDropdown").html(inHTML); 
		var chosen_subjects = [];
		$('.dropdown-menu a').on('click', function(event) {

			var $target = $(event.currentTarget),
				val = $target.attr('data-value'),
				$inp = $target.find('input'),
				idx;

			if ((idx = chosen_subjects.indexOf(val)) > -1) {
				chosen_subjects.splice(idx, 1);
				setTimeout(function() {
					$inp.prop('checked', false)
				}, 0);
			} else {
				chosen_subjects.push(val);
				setTimeout(function() {
					$inp.prop('checked', true)
				}, 0);
			}

			$(event.target).blur();
			$scope.subjects= [];
			$.each(chosen_subjects,function(index,value){
				$scope.subjects.push($scope.all_subjects[value].id);
			});
		//	console.log(chosen_subjects);
		//	console.log($scope.subjects);

			return false;
		});
		/////////
		
        $scope.$apply();
    };
	
	$scope.subjects = [];
    ParseSvc.getSubjects($scope.setSubjects);
	
	$scope.engage1 = "0";
	$scope.engage2 = "0";
	$scope.engage3 = "0";
	$scope.enhance1 = "0";
	$scope.enhance2 = "0";
	$scope.enhance3 = "0";
	$scope.extend1 = "0";
	$scope.extend2 = "0";
	$scope.extend3 = "0";
	
    $scope.reviewForm = function () {
        $scope.EvalForm.Title = $scope.title;
        $scope.EvalForm.LearningGoals = $scope.LearningGoals;
       // $scope.EvalForm.Subject = $scope.all_subjects[$scope.subject];
		$scope.EvalForm.Subjects = $scope.subjects;
        $scope.EvalForm.Document = $scope.lessonDocument;
        $scope.EvalForm.URL = $scope.LessonURL;
        $scope.EvalForm.GradeLevel = $scope.gradeLevel;
		$scope.EvalForm.EngageComment = $scope.EngageComment;
		$scope.EvalForm.EnhanceComment = $scope.EnhanceComment;
		$scope.EvalForm.ExtendComment = $scope.ExtendComment;
        if ($scope.tagString)
        {
            $scope.EvalForm.Tags = $scope.tagString.split(" ");
			$scope.EvalForm.Tags = $scope.EvalForm.Tags.filter(function (entry) { return entry.trim() != ''; });
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
		console.log($scope.EvalForm.IndividualScores);
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

