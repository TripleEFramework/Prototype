// scripts/routes.js
angular.module('App').config(function($routeProvider) {
	$routeProvider
		.when('/', {
			templateUrl: 'components/login/login.html',
			controller: 'LoginController'
		})
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
		.when('/copy-eval', {
			templateUrl: 'components/copy_eval/copy_eval.html',
			controller: 'CopyEvalController'
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
		.when('/profile', {
			templateUrl: 'components/profile/profile.html',
			controller: 'ProfileController'
		})
});
