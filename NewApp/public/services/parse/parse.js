// app/modules/patient/controllers.js
var parseModule = angular.module('Parse', ['Keys']);
var user_data = [];
var credentials = [];
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
        user_data = user;
        credentials = disqusSignon();
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
            //$.post('/login', _user, function (user_session) {
            //    //Handle server response
            //    if (user_session.success) {
            //        //Use cookie returned by server to set user on client
            //        Parse.User.become(user_session.user_session).then(function (user) {
            //            console.log(Parse.User.current());
            //            successCallback(true);
            //        }, function (error) {
            //            console.log(error);
            //        });

            //    } else {
            //        successCallback(false, user_session.message);
            //    }
            //});
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
            newEvalForm.set("Subjects", _EvalForm.Subjects);
            newEvalForm.set("GradeLevels", _EvalForm.GradeLevels);
            newEvalForm.set("LearningGoals", _EvalForm.LearningGoals);
            newEvalForm.set("Document", _EvalForm.Document);
            newEvalForm.set("Keywords", _EvalForm.Keywords);
            newEvalForm.set("URL", _EvalForm.URL);
            newEvalForm.set("TotalScore", _EvalForm.TotalScore);
            newEvalForm.set("Author", user);
            newEvalForm.set("AuthorName", user.get("username"))
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
            if (title) {
                query.matches("Title", (new RegExp(title, 'i')));
            }
            return query;
        },
        searchLearningGoals: function (query, learningGoals) {
            if (learningGoals) {
                query.matches("LearningGoals", (new RegExp(learningGoals, 'i')));
            }
            return query;
        },
        searchAuthor: function (query, author) {
            if (author) {
                var authors = Parse.Object.extend("User");
                var author_query = new Parse.Query(authors);
                author_query.matches("username", (new RegExp(author, 'i')));
                query.matchesQuery("Author", author_query);
            }
            return query;
        },
        searchSubjects: function (query, subjects) {
            //returns evals which contain any subjects requested
            if (subjects.length > 0) {
                query.containedIn("Subjects", subjects);
                //    $.each(subjects,function(index,value){
                //       query.equalTo("Subjects",value);
                //    });
            }
            return query;
        },
        searchGradeLevels: function (query, grade_levels) {
            if (grade_levels.length > 0) {
                query.containedIn("GradeLevels", grade_levels);
                //   $.each(grade_levels,function(index,value){
                //       query.equalTo("GradeLevels",value);
                //   });
            }
            return query;

        },
        searchTotalScore: function (query, totalScore) {
            if (totalScore) {
                query.equalTo("TotalScore", totalScore);
            }
            return query;
        },
        searchMinScore: function (query, minScore) {
            if (minScore) {
                query.greaterThanOrEqualTo("TotalScore", minScore);
            }
            return query;
        },
        searchTags: function (query, tags) { //Actually searches through keywords
            if (tags.length > 0) {
                query.containedIn("Keywords", tags); //Case sensitive so im going to make it so all tags are stored in lowercase
            }
            return query;
        },
        executeQuery: function (query, successCallback) {
            query.select("Author", "AuthorName", "Title", "LearningGoals", "TotalScore", "IndividualScores", "Engage", "Enhance", "Extend", "Subjects", "GradeLevels");

            query.find().then(function (results) {
                successCallback(results);
            });
        },
        getEval: function (objectId, sucessCallback) {
            var eval = Parse.Object.extend("EvalForm");
            var eval_query = new Parse.Query(eval);
            eval_query.equalTo("objectId", objectId);
            eval_query.select("Author", "AuthorName", "Title", "LearningGoals", "TotalScore", "IndividualScores", "GradeLevels", "Subjects", "Engage", "Enhance", "Extend", "EngageComment", "EnhanceComment", "ExtendComment", "URL", "Tags", "Document");
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
        getGradeLevels: function (sucessCallback) {
            var grade_level = Parse.Object.extend("GradeLevel");
            var grade_level_query = new Parse.Query(grade_level);
            grade_level_query.select("GradeLevel");
            grade_level_query.find().then(function (results) {
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
