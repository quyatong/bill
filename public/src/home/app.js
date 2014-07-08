'use strict'

require([
	'angular',
	'angularRoute',
	'src/home/controllers/main'
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
				templateUrl: 'home.tmpl',
				resolve: {
					records: ['$http', function($http) {
						return $http.get('/record/list')
					}]
				},
				controller: 'home'
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