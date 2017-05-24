var search = angular.module('Search', []);

search.controller('SearchController', ['$location', '$scope', 'ParseSvc', function ($location, $scope, ParseSvc) {
    $scope.results = [];
    $scope.all_subjects = [];
  //  $scope.gradeLevels = ['K-2', '3-5', 'K-5', '6-8', '9-12', '6-12', 'All Grades'];
    $scope.all_grade_levels =[];
    $scope.setEval = function (objectId) {
        console.log(objectId);
        //ParseSvc.getEval(objectId, $scope.printForm);
        ParseSvc.currentEval = objectId;
        $location.path('/show-eval');
    };
    // Initial scope values
    $scope.setSubjects = function (parse_subjects) {
        $scope.all_subjects = parse_subjects;
		
		//subjects dropdown checkbox stuff
		var inHTML = "";

		$.each($scope.all_subjects, function(index, value){
			var newItem = '<li><a class="small" data-value="'+$scope.all_subjects.indexOf(value)+'" tabIndex="-1"><input type="checkbox"/>&nbsp;'+value.get("subjectName")+'</a></li>';
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
			$scope.subjects = [];
			$.each(chosen_subjects,function(index,value){
				$scope.subjects.push($scope.all_subjects[value].id);
			});
		//	console.log(chosen_subjects);
		//	console.log($scope.subjects);
			console.log($scope.grade_levels);
            console.log($scope.subjects);
			return false;
		});
		////////////
        $scope.$apply();
    };
    $scope.setGradeLevels = function (parse_grade_levels) {
        $scope.all_grade_levels = parse_grade_levels;
        
        //grade_levels dropdown checkbox stuff
        var inHTML = "";

        $.each($scope.all_grade_levels, function(index, value){
            var newItem = '<li><a class="small" data-value="'+$scope.all_grade_levels.indexOf(value)+'" tabIndex="-1"><input type="checkbox"/>&nbsp;'+value.get("GradeLevel")+'</a></li>';
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
            $.each(chosen_grade_levels,function(index,value){
                $scope.grade_levels.push($scope.all_grade_levels[value]);
            });
          //console.log(chosen_grade_levels);
          console.log($scope.grade_levels);
          console.log($scope.subjects);
            return false;
        });
        ////////////
        //$scope.$apply();
    };
    ParseSvc.getGradeLevels($scope.setGradeLevels);
    ParseSvc.getSubjects($scope.setSubjects);
    
    //After initialized

    $scope.successCallback = function (results) {
        for (i = 0; i < results.length; ++i) {
			console.log(results[i].id);
			console.log(i);
			var subject_names = "";
			if(results[i].has("Subjects")){
				$.each(results[i].get("Subjects"),function(index,value){
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
            var grade_levels_string= "";
            var first_grade = true;
            if(results[i].has("GradeLevels")){
                $.each(results[i].get("GradeLevels"),function(index,value){

                    if(first_grade){
                        grade_levels_string = value;
                        first_grade=false;
                    }
                    else{
                        grade_levels_string = grade_levels_string+ ", "+ value;
                    }

                    
                });
            }
			console.log("test");
            $scope.results.push({
                title: String(results[i].get("Title")),
                //    LearningGoals: String(results[i].get("LearningGoals")),
                username: results[i].get("Author").get("username"),
                score: results[i].get("TotalScore"),
                individual_scores: results[i].get("IndividualScores"),
                subjects: subject_names,
                gradelevel: grade_levels_string,
                engagetotal: results[i].get("Engage"),
                enhancetotal: results[i].get("Enhance"),
                extendtotal: results[i].get("Extend"),
                objectId: results[i].id
            });
        }
        $scope.$apply();
        //console.log($scope.results);
    };
    $scope.queryString = "";
    $scope.LearningGoals = "";
    $scope.authorString = "";
    $scope.grade_levels = [];
    $scope.subjects = [];
    $scope.totalScore = 0;
    $scope.score1 = 0;
    $scope.score2 = 0;
    $scope.score3 = 0;
    $scope.tagString = "";
    $scope.minScore = "";
    $scope.searchTags = [];
    $scope.searchEvals = function () {
        $scope.results = [];
        $("#search-results").attr("hidden", false);
        $scope.searchTags = $scope.tagString.split(" ");
        $scope.searchTags = $scope.searchTags.filter(function (entry) { return entry.trim() != ''; });
        var minScore = parseInt($scope.minScore, 10);
		
        var query = ParseSvc.initEvalQuery();
        query = ParseSvc.searchAuthor(query, $scope.authorString);
        query = ParseSvc.searchTitle(query, $scope.queryString);
        query = ParseSvc.searchTags(query, $scope.searchTags);
        query = ParseSvc.searchMinScore(query, minScore);
        query = ParseSvc.searchSubjects(query, $scope.subjects);
        query = ParseSvc.searchGradeLevels(query, $scope.grade_levels);
        ParseSvc.executeQuery(query, $scope.successCallback);
    };
}]);
