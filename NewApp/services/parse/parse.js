// app/modules/patient/controllers.js
var parseModule = angular.module('Parse', ['Keys']);

parseModule.factory('ParseSvc', ['$http', 'KeySvc', function ($http, KeySvc) {
    key1 = KeySvc.key1;
    key2 = KeySvc.key2;
    key3 = KeySvc.key3;
    Parse.initialize(key1, key2);
    Parse.serverURL = 'https://parseapi.back4app.com';
    var isRegistered;
    var user = Parse.User.current();
    var currentEval;
    if (user) {
        isRegistered = true;
        // do stuff with the user
    } else {
        isRegistered = false;
        user = new Parse.User();
    }

    return {
        isRegistered: isRegistered,
        getUsername: function () {
            return user.get('username');
        },
        login: function (_user, successCallback) {
            Parse.User.logIn(_user.username, _user.password, {
                success: function (_user) {
                    user = _user;
                    console.log(user.get('username'));
                    successCallback(true);
                },
                error: function (user, error) {
                    // The login failed. Check error to see why
                    successCallback(false, error.message);
                }
            });
        },
        signUp: function (_user, successCallback) {
            user = new Parse.User();
            user.set("username", _user.username.toLowerCase());
            user.set("email", _user.email);
            user.set("password", _user.password);
            user.set("firstName", _user.firstName);
            user.set("lastName", _user.lastName);
            user.signUp(null, {
                success: function (user) {
                    // Hooray! Let them use the app now.
                    successCallback(true);
                },
                error: function (user, error) {
                    // Show the error message somewhere and let the user try again.
                    successCallback(false, error.message);
                }
            });
        },
        reviewForm: function (_EvalForm, successCallback) {
            var EvalFormClass = new Parse.Object.extend("EvalForm");
            var newEvalForm = new EvalFormClass();
            newEvalForm.set("Title", _EvalForm.Title);
            newEvalForm.set("Subject", _EvalForm.Subject);
            newEvalForm.set("GradeLevel", _EvalForm.GradeLevel);
            newEvalForm.set("LearningGoals", _EvalForm.LearningGoals);
            newEvalForm.set("Document", _EvalForm.Document);
            newEvalForm.set("URL", _EvalForm.URL);
            newEvalForm.set("TotalScore", _EvalForm.TotalScore);
            newEvalForm.set("Author", user);
            newEvalForm.set("IndividualScores", _EvalForm.IndividualScores);
            newEvalForm.set("Tags", _EvalForm.Tags);
            newEvalForm.set("Engage", _EvalForm.Engage);
            newEvalForm.set("Enhance", _EvalForm.Enhance);
            newEvalForm.set("Extend", _EvalForm.Extend);
            newEvalForm.set("EngageComment", _EvalForm.EngageComment);
            newEvalForm.set("EnhanceComment", _EvalForm.EnhanceComment);
            newEvalForm.set("ExtendComment", _EvalForm.ExtendComment);
            newEvalForm.save(null, {
                success: function (newEvalForm) {
                    // Execute any logic that should take place after the object is saved.
                    successCallback(true, newEvalForm.id);
                },
                error: function (newEvalForm, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    successCallback(false, error.message);
                }
            });

        },
        resetPassword: function (email, successCallback) {
            Parse.User.requestPasswordReset(email, {
                success: function () {
                    // Password reset request was sent successfully
                    successCallback(true, "");
                },
                error: function (error) {
                    // Show the error message somewhere
                    successCallback(false, error.message);
                }
            });
        },
        logout: function (sucessCallback) {
            Parse.User.logOut();

            var currentUser = Parse.User.current();
            user = Parse.User.current();
            isRegistered = false;
            sucessCallback();
        },
        getUsers: function (sucessCallback) {
            var user_query = new Parse.Query(Parse.User);
            user_query.select("username", "email");
            user_query.find().then(function (results) {
                sucessCallback(results);
            });
        },
        initEvalQuery: function () {
            var eval = Parse.Object.extend("EvalForm");
            var query = new Parse.Query(eval);
            return query;
        },
        searchTitle: function (query, title) {
            if(title) {
                query.matches("Title", (new RegExp(title, 'i')));
            }
            return query;
        },
        searchLearningGoals: function (query, learningGoals) {
            if(learningGoals) {
                query.matches("LearningGoals", (new RegExp(learningGoals, 'i')));
            }
            return query;
        },
        searchAuthor: function (query, author) {
            if(author) {
                var authors = Parse.Object.extend("User");
                var author_query = new Parse.Query(authors);
                author_query.matches("username", (new RegExp(author, 'i')));
                query.matchesQuery("Author", author_query);
            }
            return query;
        },
        searchSubject: function (query, subject) {
            if(subject) {
                var subjects = Parse.Object.extend("Subject");
                var subject_query = new Parse.Query(subjects);
                subject_query.matches("subjectName", (new RegExp(subject, 'i')));
                query.matchesQuery("Subject", subject_query);
            }
            return query;
        },
        searchGradeLevel: function (query, gradeLevel) {
            if(gradeLevel) {
                query.matches("GradeLevel", (new RegExp(gradeLevel, 'i')));
            }
            return query;
        },
        searchTotalScore: function (query, totalScore) {
            if(totalScore) {
                query.equalTo("TotalScore", totalScore);
            }
            return query;
        },
        searchMinScore: function (query, minScore) {
            if(minScore) {
                query.greaterThanOrEqualTo("TotalScore", minScore);
            }
            return query;
        },
        searchTags: function (query, tags) {
            if(tags.length > 0) {
                query.containedIn("Tags", tags); //Case sensitive so im going to make it so all tags are stored in lowercase
            }
            /*
            var tags_query = new Parse.Query(eval);
            tags_query.matches("Tags", (new RegExp(searchTags[0], 'i')));
            for (var i = 1; i < searchTags.length; i++) {
                var single_tag_query = new Parse.Query(eval);
                single_tag_query.matches("Tags", (new RegExp(searchTags[i], 'i')));
                tags_query = Parse.Query.or(tags_query, single_tag_query);
            }
            main_query = Parse.Query.or(main_query, tags_query);
            */
            return query;
        },
        executeQuery: function (query, successCallback) {
            query.select("Author", "Title", "LearningGoals", "TotalScore", "IndividualScores", "Engage", "Enhance", "Extend", "Subject", "GradeLevel");

            query.find().then(function (results) {
                console.log(results);
                successCallback(results);
            });
        },
        getEval: function (objectId, sucessCallback) {
            var eval = Parse.Object.extend("EvalForm");
            var eval_query = new Parse.Query(eval);
            eval_query.equalTo("objectId", objectId);
            eval_query.select("Author", "Title", "LearningGoals", "TotalScore", "IndividualScores", "GradeLevel", "Subject", "Engage", "Enhance", "Extend","EngageComment", "EnhanceComment", "ExtendComment", "URL","Tags");
            eval_query.find().then(function (result) {
                sucessCallback(result[0]);
            });
        },
        getSubjects: function (sucessCallback) {
            var subject = Parse.Object.extend("Subject");
            var subject_query = new Parse.Query(subject);
            subject_query.find().then(function (results) {
                sucessCallback(results);
            });
        },
        appOpened: function () {
            $http({
                method: 'POST',
                url: 'https://parseapi.back4app.com/1/events/AppOpened',
                headers: {
                    'X-Parse-Application-Id': "9gVPgmfhQbcvkd5jwXdtuCmIjqXLiAFWkfBGPu9s",
                    'X-Parse-REST-API-Key': "kyhaSMYNAGSslxKpiikk4BShk0GjkffpUTUrOp7P",
                    'Content-Type': "application/json"
                },
                data: {}
            });
        },
        printClicked: function (text) {
            today = new Date();
            Parse.Analytics.track('print', {
                text: text,
                date: today.toString(),
                platform: 'web'
            });
        },
		profile: function (sucessCallback) {
            var currentUser = Parse.User.current();
            user = Parse.User.current();
            sucessCallback();
        }
    };
}]);
