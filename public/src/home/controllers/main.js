'use strict'

define([
	'angular',
	'xdate',
	'src/common/ejson'
	],
	function(angular, xdate, ejson) {

	var ctrls = angular.module('ctrls', []);

	ctrls.controller('home', [
		'$scope',
		'records',
		'$filter',
		'$http',
		function($scope, records, $filter, $http) {

			$scope.avtSrc = '//s4.ksyun.com/i/4/185.png';

			$scope.data = records.data.data;

			var users = $scope.data.users;

			$scope.customers = angular.copy(users);

			var newRecordData = $scope.newRecordData = {};

			newRecordData.name = users[0];

			newRecordData.time =  new xdate().toString('yyyy-MM-dd');

			$scope.showErr = false;

			var doDig = function() {
				!$scope.$$phase && $scope.$digest();
			};

			var refreshResult = function () {

				ejson.get('/record/list').then(function (data) {
					$scope.data = data;
					users = data.users;
					newRecordData.name = users[0];
					newRecordData.money = '';
					newRecordData.comment = '';
					$scope.customers = angular.copy(users);
					$scope.showErr = false;
					doDig();
				});

			};

			$scope.addRecord = function(e) {
				e.preventDefault();
				$scope.showErr = true;
				var newCustomers = [];
				angular.forEach($scope.customers, function(ctm) {
					if (ctm.checked) {
						newCustomers.push(ctm._id);
					}
				});
				$filter('filter')($scope.customers, true, 'checked');
				$scope.newRecordData.customers = newCustomers;
				if ($scope.newRecord.$invalid || !newCustomers.length) {
					return;
				}
				
				var params = {
					outerId: newRecordData.name._id,
					money: newRecordData.money,
					time: newRecordData.time,
					comment: newRecordData.comment,
					customers: JSON.stringify(newCustomers)
				};

				ejson.get('/record/add', {data: params}).then(refreshResult);

			};

			$scope.removeRecord = function(record) {
				if (confirm('确定要删除这条记录吗？')){
					ejson.get('/record/remove/' + record._id).then(refreshResult);
				}
			};

			$scope.editRecord = function(record) {

			};

			$scope.removeUsr = function(usr) {
				if (confirm('确定要删除' + usr.name + '吗？')){
					ejson.get('/user/remove/' + usr._id).then(refreshResult);
				}
			};
			
			$scope.addUser = function(scope) {
				scope.showErr = true;
				if (!scope.newUsr) {
					return;
				}
				ejson.get('/user/add/' + scope.newUsr)
				.then(function (data) {
					var user = data.userInfo;
					scope.$parent.data.users.push(user);
					var nu = angular.copy(user);
					nu.summary = 0;
					scope.$parent.data.summarys.push(nu);
					scope.$parent.customers.push(angular.copy(user));
					scope.$parent.showAddUsr = false;
					doDig();
				});
			};

		}
	]);

	return ctrls;

});