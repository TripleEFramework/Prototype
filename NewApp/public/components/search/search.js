var search = angular.module('Search', []);

search.controller('SearchController', ['$location', '$scope', 'ParseSvc', function ($location, $scope, ParseSvc) {
    $scope.results = [];
    $scope.all_subjects = [];
    //  $scope.gradeLevels = ['K-2', '3-5', 'K-5', '6-8', '9-12', '6-12', 'All Grades'];
    $scope.all_grade_levels = [];
    var chosen_grade_levels = [];
    var chosen_subjects = [];
    $scope.setEval = function (objectId) {
        //ParseSvc.getEval(objectId, $scope.printForm);

        ParseSvc.currentEval = objectId;
        //$location.path('/show-eval/'+objectId).search({evalid: objectId});
        $location.path('/show-eval').search({ evalid: objectId });
    };
    // Initial scope values
    $scope.setSubjects = function (parse_subjects) {
        $scope.all_subjects = parse_subjects;

        //subjects dropdown checkbox stuff
        var inHTML = "";

        $.each($scope.all_subjects, function (index, value) {
            var newItem = '<li><a class="small" data-value="' + $scope.all_subjects.indexOf(value) + '" tabIndex="-1"><input type="checkbox"/>&nbsp;' + value.get("subjectName") + '</a></li>';
            inHTML += newItem;
        });

        $("ul#dynamicSubjectDropdown").html(inHTML);
        $('#dynamicSubjectDropdown a').on('click', function (event) {

            var $target = $(event.currentTarget),
                val = $target.attr('data-value'),
                $inp = $target.find('input'),
                idx;

            if ((idx = chosen_subjects.indexOf(val)) > -1) {
                chosen_subjects.splice(idx, 1);
                setTimeout(function () {
                    $inp.prop('checked', false)
                }, 0);
            } else {
                chosen_subjects.push(val);
                setTimeout(function () {
                    $inp.prop('checked', true)
                }, 0);
            }

            $(event.target).blur();
            $scope.subjects = [];
            $.each(chosen_subjects, function (index, value) {
                $scope.subjects.push($scope.all_subjects[value].id);
            });
            return false;
        });
        ////////////
        $scope.$apply();
        $scope.performSearch();
    };
    $scope.setGradeLevels = function (parse_grade_levels) {
        $scope.all_grade_levels = parse_grade_levels;

        //grade_levels dropdown checkbox stuff
        var inHTML = "";

        $.each($scope.all_grade_levels, function (index, value) {
            var newItem = '<li><a class="small" data-value="' + $scope.all_grade_levels.indexOf(value) + '" tabIndex="-1"><input type="checkbox"/>&nbsp;' + value.get("GradeLevel") + '</a></li>';
            inHTML += newItem;
        });

        $("ul#dynamicGradeLevelDropdown").html(inHTML);
      //  var chosen_grade_levels = [];

        $('#dynamicGradeLevelDropdown a').on('click', function (event) {

            var $target = $(event.currentTarget),
                val = $target.attr('data-value'),
                $inp = $target.find('input'),
                idx;

            if ((idx = chosen_grade_levels.indexOf(val)) > -1) {
                chosen_grade_levels.splice(idx, 1);
                setTimeout(function () {
                    $inp.prop('checked', false)
                }, 0);
            } else {
                chosen_grade_levels.push(val);
                setTimeout(function () {
                    $inp.prop('checked', true)
                }, 0);
            }

            $(event.target).blur();
            $scope.grade_levels = [];
            $.each(chosen_grade_levels, function (index, value) {
                grade_level_object = $scope.all_grade_levels[value];
                $scope.grade_levels.push(grade_level_object.get("GradeLevel"));
            });
            return false;

        });


        //ParseSvc.getSubjects($scope.setSubjects);
        ////////////
        //$scope.$apply();
    };
    ParseSvc.getGradeLevels($scope.setGradeLevels);
    ParseSvc.getSubjects($scope.setSubjects);
    //After initialized

    $scope.successCallback = function (results) {
        if (results.length < 1) {
            $("#no-search-results").attr("hidden", false);
        }
        else {
            for (i = 0; i < results.length; ++i) {
                var subject_names = "";
                if (results[i].has("Subjects")) {
                    $.each(results[i].get("Subjects"), function (index, value) {
                        for (t = 0; t < $scope.all_subjects.length; ++t) {
                            if (value == $scope.all_subjects[t].id) {
                                if (index == 0) {
                                    subject_names = $scope.all_subjects[t].get("subjectName");
                                }
                                else {
                                    subject_names = subject_names + ", " + $scope.all_subjects[t].get("subjectName");
                                }
                                break;
                            }
                        }
                    });
                }
                var grade_levels_string = "";
                var first_grade = true;
                if (results[i].has("GradeLevels")) {
                    $.each(results[i].get("GradeLevels"), function (index, value) {

                        if (first_grade) {
                            grade_levels_string = value;
                            first_grade = false;
                        }
                        else {
                            grade_levels_string = grade_levels_string + ", " + value;
                        }
                    });
                }
                $scope.results.push({
                    title: String(results[i].get("Title")),
                    //    LearningGoals: String(results[i].get("LearningGoals")),
                    username: results[i].get("AuthorName"),
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
        }
        $("#search-results").attr("hidden", false);
        $scope.$apply();
    };
    $scope.titleString = "";
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
        $scope.tagString = $scope.tagString.toLowerCase();
        $scope.searchTags = $scope.tagString.split(" ");
        $scope.searchTags = $scope.searchTags.filter(function (entry) { return entry.trim() != ''; });
        var minScore = parseInt($scope.minScore, 10);

        var search_params = {};
        if ($scope.authorString) {
            search_params.authorString = $scope.authorString;
        }
        if ($scope.titleString) {
            search_params.titleString = $scope.titleString;
        }
        if ($scope.minScore) {
            search_params.minScore = $scope.minScore;
        }
        if ($scope.searchTags) {
            search_params.searchTags = $scope.searchTags;
        }
        if ($scope.subjects) {
            search_params.subjects = $scope.subjects;
        }
        if ($scope.grade_levels) {
            search_params.grade_levels = $scope.grade_levels;
        }

        $location.path('/search').search(search_params);
        $scope.performSearch();
    };
    $scope.performSearch = function () {
        var query = ParseSvc.initEvalQuery();

        location_search = $location.search();
        if (location_search.hasOwnProperty("authorString")) {
            query = ParseSvc.searchAuthor(query, location_search.authorString);
            $("#author_textInput").text(location_search.authorString);
            $scope.authorString = location_search.authorString;
        }
        if (location_search.hasOwnProperty("titleString")) {
            query = ParseSvc.searchTitle(query, location_search.titleString);
            $("#title_textInput").text(location_search.titleString);
            $scope.titleString = location_search.titleString;
        }
        if (location_search.hasOwnProperty("searchTags")) {
            var searchTags = [];
            if (location_search.searchTags.constructor == Array) {
                searchTags = location_search.searchTags;
            }
            else {
                searchTags.push(location_search.searchTags);
            }
            query = ParseSvc.searchTags(query, searchTags);
            if (searchTags.length > 1) {
                tag_string = location_search.searchTags.join(' ');
            }
            else {
                tag_string = location_search.searchTags.toString();
            }
            $("#keyword_textInput").text(tag_string);
            $scope.tagString = tag_string;

        }
        if (location_search.hasOwnProperty("minScore")) {
            var minScore = parseInt(location_search.minScore, 10);
            query = ParseSvc.searchMinScore(query, minScore);
            $("#minscore_textInput").text(location_search.minScore);
            $scope.minScore = location_search.minScore;
        }
        if (location_search.hasOwnProperty("subjects")) {
            var subjects = [];
            if (location_search.subjects.constructor == Array) {
                subjects = location_search.subjects;
            }
            else {
                subjects.push(location_search.subjects);
            }
            query = ParseSvc.searchSubjects(query, subjects);
            $scope.subjects = subjects;
            $.each($('#dynamicSubjectDropdown a'), function (index, value) {
                var target = value,
                    val = target.attributes.getNamedItem("data-value").value,
                    inp = target.children[0];

                if (($scope.subjects.indexOf($scope.all_subjects[val].id)) > -1) {
                    chosen_subjects.push(val);
                    setTimeout(function () {
                        inp.checked = true;
                    }, 0);
                }
            });
        }
        if (location_search.hasOwnProperty("grade_levels")) {
            var grade_levels = [];
            if (location_search.grade_levels.constructor == Array) {
                grade_levels = location_search.grade_levels;
            }
            else {
                grade_levels.push(location_search.grade_levels);
            }
            query = ParseSvc.searchGradeLevels(query, grade_levels);
            $scope.grade_levels = grade_levels;
            $.each($('#dynamicGradeLevelDropdown a'), function (index, value) {
                var target = value,
                    val = target.attributes.getNamedItem("data-value").value,
                    inp = target.children[0];

                if (($scope.grade_levels.indexOf(val)) > -1) {
                    chosen_grade_levels.push(val);
                    setTimeout(function () {
                        inp.checked = true;
                    }, 0);
                }
            });

        }
        ParseSvc.executeQuery(query, $scope.successCallback);

    }
}]);
