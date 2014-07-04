'use strict'

define(['angular'], function(angular) {

	var ctrls = angular.module('ctrls', []);

	ctrls.controller('index', [
		'$scope',
		'records',
		function($scope, records) {

			$scope.data = records.data.data;

			$scope.customers = angular.copy($scope.data.users);

			$scope.addRecord = function(e) {
				e.preventDefault();
				console.log($scope.newRecord);
				console.log($scope)
			};

		}
	]);

	return ctrls;

});