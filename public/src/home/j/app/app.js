'use strict'

require.config({
	baseUrl: 'j/app/',
	paths: {
		angular: '/j/lib/angular',
		angularRoute: '/j/lib/angular-route.min'
	},
	shim: {
		angular: {
			exports: 'angular'
		},
		angularRoute: ['angular']
	}
});

require([
	'angular',
	'angularRoute',
	'controllers/main'
	], function(angular) {

	var appName = 'app';
	var app = angular.module(appName, ['ctrls', 'ngRoute']);

	app.config([
		'$routeProvider',
		'$locationProvider',
		'$compileProvider',
		function($routeProvider, $locationProvider, $compileProvider) {

			$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|javascript|chrome-extension):/);
			$locationProvider.html5Mode(true).hashPrefix('!');

			$routeProvider
			.when('/', {
				templateUrl: 'index.tmpl',
				controller: 'index'
			})
			.otherwise({
				redirectTo: '/'
			});

		}
	]);

	app.run([
		'$rootScope',
		function($rootScope) {

			// ....

		}
	]);

	angular.element().ready(function() {
		angular.bootstrap(document.documentElement, [appName]);
	});

});