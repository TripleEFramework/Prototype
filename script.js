// script.js

// create the module and name it app
var app = angular.module('app', ['keys']);

// create the controller and inject Angular's $scope
app
.controller('main', ['$scope', '$rootScope', 'ParseSvc', function($scope, $rootScope, ParseSvc){
  //calls appOpened once on controller's instantiation
  var init = function() {
    ParseSvc.appOpened();
  };
  init();
  //Keep user logged in if they still have a session
  if(ParseSvc.getUsername() !== null){
	  $rootScope.username=ParseSvc.getUsername();
  }
  $scope.username = $rootScope.username;
  $rootScope.$on('new username', function(event, data){
    $scope.username= data;
    if ($scope.username !== "" ) {
      $scope.$apply();
    }
  });
 
  $scope.isUser =function() {
    if ($scope.username === "" || $scope.username === undefined) {
      return false;
    }
    else {
      return true;
    }
  }
}])
.controller('userlist', ['$scope', 'ParseSvc', function($scope, ParseSvc){
  $scope.users = [];
  $scope.sucessCallback = function(results) {
    for (i = 0; i < results.length; ++i) {
      $scope.users.push({
        username: results[i].getUsername(),
        email: results[i].getEmail()
      });
    } 
    $scope.$apply();
    console.log($scope.users);
  };
  ParseSvc.getUsers($scope.sucessCallback);
}])


//code to print text
.controller('search', ['$scope','ParseSvc', function($scope, ParseSvc){
  $scope.results = [];
  $scope.subjects = [];
  $scope.gradeLevels = ['Elementary','Middle School','High School','College'];
  $scope.printForm = function(result){
	  $("#search-results").attr("hidden", true);
	  $("#selected-search-result").attr("hidden",false);
	  $("tr > td > label").attr("hidden",true);
	  $("#chosen-lesson-title").text(result.get("Title"));
	  $("#chosen-lesson-score").text(String(result.get("TotalScore")));
	  $("#chosen-lesson-author").text(String(result.get("Author").get("username")));
	  $("#engage1"+result.get("IndividualScores").engage1).attr("hidden",false);
	  $("#engage2"+result.get("IndividualScores").engage2).attr("hidden",false);
	  $("#engage3"+result.get("IndividualScores").engage3).attr("hidden",false);
	  $("#enhance1"+result.get("IndividualScores").enhance1).attr("hidden",false);
	  $("#enhance2"+result.get("IndividualScores").enhance2).attr("hidden",false);
	  $("#enhance3"+result.get("IndividualScores").enhance3).attr("hidden",false);
	  $("#extend1"+result.get("IndividualScores").extend1).attr("hidden",false);
	  $("#extend2"+result.get("IndividualScores").extend2).attr("hidden",false);
	  $("#extend3"+result.get("IndividualScores").extend3).attr("hidden",false);
	  
  };
  $scope.displayEval = function(objectId){
	console.log(objectId);
//	$("#search-tab").removeClass("active");  // this deactivates the home tab
//	$("#search").removeClass("tab-pane fade ng-scope active in");
//	$("#search").addClass("tab-pane fade ng-scope");
//	$("#form-tab").addClass("active");  // this activates the profile tab
//	$("#triplee").removeClass("tab-pane fade ng-scope");
//	$("#triplee").addClass("tab-pane fade ng-scope active in");
	ParseSvc.getEval(objectId, $scope.printForm);
  };
 // Initial scope values
	$scope.setSubjects = function(parseSubjects){
		
	//	for (i = 0; i < parseSubjects.length; ++i) {
	//		$scope.subjects.push({
	//		subjectName: parseSubjects[i].get("subjectName")
	//		});
	//	} 
		$scope.subjects = parseSubjects;
		$scope.$apply();
	};
  ParseSvc.getSubjects($scope.setSubjects);
 
 //After initialized
  
  
  
  $scope.successCallback = function(results) {
    for (i = 0; i < results.length; ++i) {
      $scope.results.push({
        title: String(results[i].get("Title")),
        username: results[i].get("Author").get("username"),
        score: results[i].get("TotalScore"),
        individual_scores: results[i].get("IndividualScores"),
		objectId: results[i].id
      });
    } 
    $scope.$apply();
    console.log($scope.results);
  };
  $scope.queryString = "";
  $scope.authorString = "";
  $scope.gradeLevel = "";
  $scope.subject= "";
  $scope.totalScore= 0;
  $scope.score1= 0;
  $scope.score2= 0;
  $scope.score3= 0;
  $scope.searchEvals = function() {
    $scope.results  = [];
	$("#search-results").attr("hidden", false);
	$("#selected-search-result").attr("hidden",true);
    ParseSvc.getEvals($scope.queryString,
                               $scope.authorString, 
                               $scope.gradeLevel, 
                               $scope.subject, 
                               $scope.totalScore, 
                               $scope.score1, 
                               $scope.score2, 
                               $scope.score3,
                               $scope.successCallback);
  };
}])


.controller('login', 
  ['$scope', '$rootScope','ParseSvc', function($scope, $rootScope, ParseSvc){
  //callback function to set global username on login sucess
  //This is neccessary because JavaScript runs sychronously
  //callback functions are one way to preserve asynchronicity
  var loginCallback = function () {
    $rootScope.$broadcast('new username', ParseSvc.getUsername());
  }
  
  $scope.user = {
    username: null,
    password: null,
  };
  
  if(ParseSvc.isRegistered) {
    $rootScope.username = ParseSvc.getUsername();
  }
  $scope.login = function () {
    ParseSvc.login($scope.user, loginCallback)
  }
  if(ParseSvc.getUsername() !== null){
	  $scope.user.username = ParseSvc.getUsername();
	  
  }

}])
.controller('signUp', ['$scope','$rootScope','ParseSvc', function($scope, $rootScope, ParseSvc){
  var signupCallback = function () {
    $rootScope.$broadcast('new username', ParseSvc.getUsername());
  }
  $scope.user = {
    username: null,
    password: null,
    password2: null,
    email: null,
    name: null
  };
  if(ParseSvc.isRegistered) {
    $rootScope.username = ParseSvc.getUsername();
  }
  $scope.signUp = function () {
    if ($scope.user.password !== $scope.user.password2) {
      alert('Passwords don\'t match');
      return;
    }
    ParseSvc.signUp($scope.user, signupCallback);
  }

}])
//////////////////////////////////////////////////
.controller('reviewForm', ['$scope','$rootScope','ParseSvc', function($scope, $rootScope, ParseSvc){
  $scope.EvalForm = {
    Author: null,
	Title: null,
    TotalScore: 0,
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
  $scope.reviewForm = function () {
	$scope.EvalForm.Title = $scope.title;
	
	$scope.EvalForm.IndividualScores.engage1= $scope.engage1;
	$scope.EvalForm.IndividualScores.engage2= $scope.engage2;
	$scope.EvalForm.IndividualScores.engage3= $scope.engage3;
	$scope.EvalForm.IndividualScores.enhance1= $scope.enhance1;
	$scope.EvalForm.IndividualScores.enhance2= $scope.enhance2;
	$scope.EvalForm.IndividualScores.enhance3= $scope.enhance3;
	$scope.EvalForm.IndividualScores.extend1= $scope.extend1;
	$scope.EvalForm.IndividualScores.extend2= $scope.extend2;
	$scope.EvalForm.IndividualScores.extend3= $scope.extend3;
	
	var score = 0;
	$(".radio:checked").each(function(){
		score+=parseInt($(this).val(),10);
	  });
	$scope.EvalForm.TotalScore = score;
	
	ParseSvc.reviewForm($scope.EvalForm);
  }

}])
//////////////////////////////////////////////
.controller('reset', ['$scope','ParseSvc', function($scope, ParseSvc){
  $scope.email = null;
  $scope.resetPassword = function () {
    ParseSvc.resetPassword($scope.email)
  }

}])
.controller('logout', ['$scope','$rootScope','ParseSvc', function($scope, $rootScope, ParseSvc){
  var logoutCallback = function() {
    $rootScope.$broadcast('new username', "");
  }
  $scope.logout = function () {
    ParseSvc.logout(logoutCallback);
  }

}])

.factory('ParseSvc', ['$http', 'KeySvc', function($http, KeySvc) {

  key1 = KeySvc.key1;
  key2 = KeySvc.key2;
  key3 = KeySvc.key3;
  Parse.initialize(key1, key2);
  Parse.serverURL = 'https://parseapi.back4app.com';
  var isRegistered;
  var user = Parse.User.current();
  if (user) {
    isRegistered = true;
    // do stuff with the user
  } else {
    isRegistered = false;
    user = new Parse.User();
  }

  return {
    isRegistered: isRegistered,
    getUsername: function() {
      return user.get('username');
    },
    login: function(_user, successCallback) {
      Parse.User.logIn(_user.username, _user.password, {
        success: function(_user) {
          user = _user;
          console.log(user.get('username'));
          // Do stuff after successful login.
          alert('Logged in as ' + user.get('username'));
          successCallback();
        },
        error: function(user, error) {
          // The login failed. Check error to see why
          console.log("Error: " + error.code + " " + error.message);
          alert('Login failed');
        }
      });
    },
    signUp: function(_user, successCallback) {
      user = new Parse.User();
      user.set("username", _user.username.toLowerCase());
      user.set("email", _user.email);
      user.set("password", _user.password);
      user.set("firstName", _user.firstName);
      user.set("lastName", _user.lastName);
      user.signUp(null, {
        success: function(user) {
          // Hooray! Let them use the app now.
          alert('Signed up successfully')
          successCallback();
        },
        error: function(user, error) {
          // Show the error message somewhere and let the user try again.
          alert('There was an error. See the log to ge the message')
            console.log("Error: " + error.code + " " + error.message);
        }
      });
    },
	reviewForm: function(_EvalForm) {
		var EvalFormClass = new Parse.Object.extend("EvalForm");
		var newEvalForm = new EvalFormClass();
		newEvalForm.set("Title", _EvalForm.Title);
		newEvalForm.set("TotalScore", _EvalForm.TotalScore);
		newEvalForm.set("Author", user);
		newEvalForm.set("IndividualScores", _EvalForm.IndividualScores);
		newEvalForm.set("Title", _EvalForm.Title);
		newEvalForm.save(null, {
			success: function(newEvalForm) {
				// Execute any logic that should take place after the object is saved.
				var scorestring = String(newEvalForm.get("TotalScore"));
				alert('Evaluation Saved, Score: ' + scorestring);
			},
			error: function(newEvalForm, error) {
				// Execute any logic that should take place if the save fails.
				// error is a Parse.Error with an error code and message.
				alert('Failed to create new object, with error code: ' + error.message);
			}
		});
		
	},
    resetPassword: function(email) {
      Parse.User.requestPasswordReset(email, {
        success: function() {
          // Password reset request was sent successfully
          alert("password reset link sent")
        },
        error: function(error) {
          // Show the error message somewhere
          alert("Error: " + error.code + " " + error.message);
        }
      });
    },
    logout: function(sucessCallback) {
      Parse.User.logOut();
      console.log('logged out');
      alert('logged out');

      var currentUser = Parse.User.current(); 
      user = Parse.User.current(); 
      isRegistered = false;
      sucessCallback();
    },
    getUsers: function(sucessCallback) {
      var user_query = new Parse.Query(Parse.User);
      user_query.select("username", "email");
      user_query.find().then(function(results) {
        sucessCallback(results);
      });
    },
    getEvals: function(title, author, gradeLevel, subject, totalScore, score1, score2, score3, sucessCallback) {
      var eval = Parse.Object.extend("EvalForm");
      var main_query = new Parse.Query(eval);

      // Title search
      if (title) {
        main_query.contains("Title", title);
      }

      // Author search
      if (author) {
        var authors = Parse.Object.extend("User");
        var author_query = new Parse.Query(authors);
        author_query.contains("username", author);
        main_query.matchesQuery("Author", author_query);
      }

      // Subject search
      if (subject) {
        var subjects = Parse.Object.extend("Subject");
        var subject_query = new Parse.Query(subjects);
        subject_query.contains("subjectName", subject);
        main_query.matchesQuery("Subject", subject_query);
      }

      // Grade Level search
      if (gradeLevel) {
        main_query.contains("GradeLevel", gradeLevel);
      }

      // Total Score search
      if (totalScore) {
        main_query.equalTo("TotalScore", totalScore);
      }

      main_query.select("Author", "Title", "TotalScore", "IndividualScores");
      main_query.find().then(function(results) {
        sucessCallback(results);
      });
    },
	getEval: function(objectId, sucessCallback) {
      var eval = Parse.Object.extend("EvalForm");
      var eval_query = new Parse.Query(eval);
	  eval_query.equalTo("objectId", objectId);
      eval_query.select("Author", "Title", "TotalScore", "IndividualScores");
      eval_query.find().then(function(result) {
        sucessCallback(result[0]);
      });
    },
    getSubjects: function(sucessCallback) {
      var subject = Parse.Object.extend("Subject");
      var subject_query = new Parse.Query(subject);
      subject_query.find().then(function(results) {
        sucessCallback(results);
      });
    },
    appOpened: function() {
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
    printClicked: function(text) {
      today = new Date();
      Parse.Analytics.track('print', {
        text: text,
        date: today.toString(),
        platform: 'web'
      });
    }
  };
}])
;
