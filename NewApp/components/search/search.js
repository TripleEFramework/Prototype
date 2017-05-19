var search = angular.module('Search', []);

search.controller('SearchController', ['$location', '$scope', 'ParseSvc', function ($location, $scope, ParseSvc) {
    $scope.results = [];
    $scope.subjects = [];
    $scope.gradeLevels = ['K-2', '3-5', 'K-5', '6-8', '9-12', '6-12', 'All Grades'];
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
        //console.log($scope.results);
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
        $scope.searchTags = $scope.tagString.split(" ");
        $scope.searchTags = $scope.searchTags.filter(function (entry) { return entry.trim() != ''; });
        var minScore = parseInt($scope.minScore, 10);
		
        var query = ParseSvc.initEvalQuery();
        query = ParseSvc.searchAuthor(query, $scope.authorString);
        query = ParseSvc.searchTitle(query, $scope.queryString);
        query = ParseSvc.searchTags(query, $scope.searchTags);
        query = ParseSvc.searchMinScore(query, minScore);
        query = ParseSvc.searchSubject(query, $scope.subject);
        query = ParseSvc.searchGradeLevel(query, $scope.gradeLevel);
        ParseSvc.executeQuery(query, $scope.successCallback);
    };
}]);
