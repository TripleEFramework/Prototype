var search = angular.module('Search', []);

search.controller('SearchController', ['$location', '$scope', 'ParseSvc', function ($location, $scope, ParseSvc) {
    $scope.results = [];
    $scope.subjects = [];
    $scope.gradeLevels = ['K-2', '3-5', 'K-5', '6-8', '9-12', '6-12', 'All Grades'];
    $scope.printForm = function (result) {
        $("#search-results").attr("hidden", true);
        $("#selected-search-result").attr("hidden", false);
        $("#chosen-individual-scores > tr > td > label").attr("hidden", true);
        $("#chosen-lesson-title").text(result.get("Title"));
	    $("#chosen-lesson-URL").text(result.get("URL"));
        $("#chosen-learning-goals").text(result.get("LearningGoals"));
        $("#chosen-lesson-score").text(String(result.get("TotalScore")));
        $("#chosen-lesson-author").text(String(result.get("Author").get("username")));
        $("#chosen-lesson-subject").text(String(result.get("Subject").get("subjectName")));
        $("#chosen-lesson-grade").text(String(result.get("GradeLevel")));
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

    };
    $scope.setEval = function (objectId) {
        console.log(objectId);
        //ParseSvc.getEval(objectId, $scope.printForm);
        ParseSvc.currentEval = objectId;
        $location.path('/show-eval');
    };
    // Initial scope values
    $scope.setSubjects = function (parseSubjects) {
        $scope.subjects = parseSubjects;
        $scope.$apply();
    };
    ParseSvc.getSubjects($scope.setSubjects);

    //After initialized



    $scope.successCallback = function (results) {
        for (i = 0; i < results.length; ++i) {
            $scope.results.push({
                title: String(results[i].get("Title")),
                //    LearningGoals: String(results[i].get("LearningGoals")),
                username: results[i].get("Author").get("username"),
                score: results[i].get("TotalScore"),
                individual_scores: results[i].get("IndividualScores"),
                subject: results[i].get("Subject"),
                gradelevel: results[i].get("GradeLevel"),
                engagetotal: results[i].get("Engage"),
                enhancetotal: results[i].get("Enhance"),
                extendtotal: results[i].get("Extend"),
                objectId: results[i].id
            });
        }
        $scope.$apply();
        console.log($scope.results);
    };
    $scope.queryString = "";
    $scope.LearningGoals = "";
    $scope.authorString = "";
    $scope.gradeLevel = "";
    $scope.subject = "";
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
        $("#selected-search-result").attr("hidden", true);
        $scope.searchTags = $scope.tagString.split(" ");
        $scope.searchTags = $scope.searchTags.filter(function (entry) { return entry.trim() != ''; });
        var minScore = parseInt($scope.minScore, 10);
        ParseSvc.getEvals($scope.queryString,
                                   $scope.LearningGoals,
                                   $scope.authorString,
                                   $scope.gradeLevel,
                                   $scope.subject,
                                   $scope.totalScore,
                                   $scope.score1,
                                   $scope.score2,
                                   $scope.score3,
                                   $scope.searchTags,
                                   minScore,
                                   $scope.successCallback);
    };
}]);
