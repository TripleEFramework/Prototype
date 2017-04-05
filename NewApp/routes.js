// scripts/routes.js
angular.module('App').config(function($routeProvider) {
	$routeProvider
		.when('/login', {
			templateUrl: 'components/login/login.html',
			controller: 'LoginController'
		})
		.when('/logout', {
			templateUrl: 'components/logout/logout.html',
			controller: 'LogoutController'
		})
		.when('/signup', {
			templateUrl: 'components/signup/signup.html',
			controller: 'SignupController'
		})
		.when('/submit-eval', {
			templateUrl: 'components/submit_eval/submit_eval.html',
			controller: 'SubmitEvalController'
		})
		.when('/edit-eval', {
			templateUrl: 'components/edit_eval/edit_eval.html',
			controller: 'EditEvalController'
		})
		.when('/show-eval', {
			templateUrl: 'components/show_eval/show_eval.html',
			controller: 'ShowEvalController'
		})
		.when('/search', {
			templateUrl: 'components/search/search.html',
			controller: 'SearchController'
		})
		.when('/reset-password', {
			templateUrl: 'components/reset_password/reset_password.html',
			controller: 'ResetPasswordController'
		})
});
