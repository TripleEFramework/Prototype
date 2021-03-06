var submit = angular.module('SubmitEval', []);

submit.controller('SubmitEvalController', ['$location', '$scope', '$rootScope', 'ParseSvc', function ($location, $scope, $rootScope, ParseSvc) {
    $scope.error = false;
    $scope.error_msg;

    $scope.submitCallback = function (success, response) {
        if(success) {
            ParseSvc.currentEval = response;
            $location.path('/show-eval').search({evalid: response});
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
        Keywords: null,
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
    $scope.all_grade_levels =[];

    $scope.setGradeLevels = function (parse_grade_levels) {
        $scope.all_grade_levels = parse_grade_levels;
        
        //grade_levels dropdown checkbox stuff
        var inHTML = "";

        $.each($scope.all_grade_levels, function(index, value){
            var newItem = '<li><a class="small" data-value="'+value.get("GradeLevel")+'" tabIndex="-1"><input type="checkbox"/>&nbsp;'+value.get("GradeLevel")+'</a></li>';
            inHTML += newItem;  
        });

        $("ul#dynamicGradeLevelDropdown").html(inHTML); 
        var chosen_grade_levels = [];
        $('#dynamicGradeLevelDropdown a').on('click', function(event) {

            var $target = $(event.currentTarget),
                val = $target.attr('data-value'),
                $inp = $target.find('input'),
                idx;

            if ((idx = chosen_grade_levels.indexOf(val)) > -1) {
                chosen_grade_levels.splice(idx, 1);
                setTimeout(function() {
                    $inp.prop('checked', false)
                }, 0);
            } else {
                chosen_grade_levels.push(val);
                setTimeout(function() {
                    $inp.prop('checked', true)
                }, 0);
            }

            $(event.target).blur();
            $scope.grade_levels = [];
            $.each($scope.all_grade_levels,function(index,value){
                if(chosen_grade_levels.indexOf(value.get("GradeLevel"))>-1){
                    $scope.grade_levels.push(value.get("GradeLevel"));
                }
                
            });
            return false;
        });
        ////////////
        //$scope.$apply();
    };
    ParseSvc.getGradeLevels($scope.setGradeLevels);

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
		$('#dynamicSubjectDropdown a').on('click', function(event) {

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
		$scope.EvalForm.Subjects = $scope.subjects;

        // var lesson_document_file_input = document.getElementById("lesson_doc_upload");
        // var lesson_document_file = lesson_document_file_input.files[0];
        // var lesson_doc_name = document.getElementById("lesson_doc_upload").value;
        // var lesson_document = new Parse.File(lesson_doc_name,lesson_document_file);
        // if(lesson_doc_name){
        //     $scope.EvalForm.Document = lesson_document;
        // }
        $scope.EvalForm.URL = $scope.LessonURL;
        $scope.EvalForm.GradeLevels = $scope.grade_levels;
		$scope.EvalForm.EngageComment = $scope.EngageComment;
        if(!$scope.EvalForm.EngageComment){
            $scope.EvalForm.EngageComment = "";
        }
		$scope.EvalForm.EnhanceComment = $scope.EnhanceComment;
        if(!$scope.EvalForm.EnhanceComment){
            $scope.EvalForm.EnhanceComment = "";
        }
		$scope.EvalForm.ExtendComment = $scope.ExtendComment;
        if(!$scope.EvalForm.ExtendComment){
            $scope.EvalForm.ExtendComment = "";
        }
        var combinedstring= $scope.title+' '+$scope.LearningGoals+' '+$scope.EngageComment+' '+$scope.EnhanceComment+' '+$scope.ExtendComment;
        combinedstring = combinedstring.replace(/\W/g, ' ');
        combinedstring = combinedstring.toLowerCase();
        var keywords = combinedstring.split(" ");
        keywords = keywords.filter(function (entry) { return entry.trim() != ''; });
        if ($scope.tagString)
        {
            var tags = $scope.tagString.replace(/\W/g, ' ');
            tags = tags.toLowerCase();
            $scope.EvalForm.Tags = tags.split(" ");
			$scope.EvalForm.Tags = $scope.EvalForm.Tags.filter(function (entry) { return entry.trim() != ''; });
            keywords = keywords.concat($scope.EvalForm.Tags);
        }
        $scope.EvalForm.Keywords =  keywords;
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

