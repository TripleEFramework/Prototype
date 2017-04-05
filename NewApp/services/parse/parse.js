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
                    // Do stuff after successful login.
                    // alert('Logged in as ' + user.get('username'));
                    successCallback();
                },
                error: function (user, error) {
                    // The login failed. Check error to see why
                    console.log("Error: " + error.code + " " + error.message);
                    alert('Login failed');
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
                    alert('Signed up successfully')
                    successCallback();
                },
                error: function (user, error) {
                    // Show the error message somewhere and let the user try again.
                    alert('There was an error. See the log to ge the message')
                    console.log("Error: " + error.code + " " + error.message);
                }
            });
        },
        reviewForm: function (_EvalForm) {
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
                    var scorestring = String(newEvalForm.get("TotalScore"));
                    alert('Evaluation Saved, Score: ' + scorestring);
                },
                error: function (newEvalForm, error) {
                    // Execute any logic that should take place if the save fails.
                    // error is a Parse.Error with an error code and message.
                    alert('Failed to create new object, with error code: ' + error.message);
                }
            });

        },
        resetPassword: function (email) {
            Parse.User.requestPasswordReset(email, {
                success: function () {
                    // Password reset request was sent successfully
                    alert("password reset link sent")
                },
                error: function (error) {
                    // Show the error message somewhere
                    alert("Error: " + error.code + " " + error.message);
                }
            });
        },
        logout: function (sucessCallback) {
            Parse.User.logOut();
            console.log('logged out');
            alert('logged out');

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
        getEvals: function (title, LearningGoals, author, gradeLevel, subject, totalScore, score1, score2, score3, searchTags, minScore, sucessCallback) {
            var eval = Parse.Object.extend("EvalForm");
            var main_query = new Parse.Query(eval);

            // Title search
            if (title) {
                main_query.matches("Title", (new RegExp(title, 'i')));
            }

            // learning goals search
            if (LearningGoals) {
                main_query.matches("LearningGoals", (new RegExp(LearningGoals, 'i')));
            }

            // Author search
            if (author) {
                var authors = Parse.Object.extend("User");
                var author_query = new Parse.Query(authors);
                author_query.matches("username", (new RegExp(author, 'i')));
                main_query.matchesQuery("Author", author_query);
            }

            // Subject search
            if (subject) {
                var subjects = Parse.Object.extend("Subject");
                var subject_query = new Parse.Query(subjects);
                subject_query.matches("subjectName", (new RegExp(subject, 'i')));
                main_query.matchesQuery("Subject", subject_query);
            }

            // Grade Level search
            if (gradeLevel) {
                main_query.matches("GradeLevel", (new RegExp(gradeLevel, 'i')));
            }

            // Total Score search
            if (totalScore) {
                main_query.equalTo("TotalScore", totalScore);
            }
            // Minimum Score search
            if (minScore) {
                main_query.greaterThanOrEqualTo("TotalScore", minScore);
            }

            // Tag search
            if (searchTags.length > 0) {
                main_query.containedIn("Tags", searchTags); //Case sensitive so im going to make it so all tags are stored in lowercase
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
            }

            main_query.select("Author", "Title", "LearningGoals", "TotalScore", "IndividualScores", "Engage", "Enhance", "Extend", "Subject", "GradeLevel");

            main_query.find().then(function (results) {
                console.log(results);
                sucessCallback(results);
            });
        },
        getEval: function (objectId, sucessCallback) {
            var eval = Parse.Object.extend("EvalForm");
            var eval_query = new Parse.Query(eval);
            eval_query.equalTo("objectId", objectId);
            eval_query.select("Author", "Title", "LearningGoals", "TotalScore", "IndividualScores", "GradeLevel", "Subject", "Engage", "Enhance", "Extend","EngageComment", "EnhanceComment", "ExtendComment", "URL");
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
        }
    };
}]);
