'use strict';

//Setting up route
angular.module('toys').config(['$stateProvider',
	function($stateProvider) {
		// Toys state routing
		$stateProvider.
		state('listToys', {
			url: '/toys',
			templateUrl: 'modules/toys/views/list-toys.client.view.html'
		}).
		state('createToy', {
			url: '/toys/create',
			templateUrl: 'modules/toys/views/create-toy.client.view.html'
		}).
		state('viewToy', {
			url: '/toys/:toyId',
			templateUrl: 'modules/toys/views/view-toy.client.view.html'
		}).
		state('editToy', {
			url: '/toys/:toyId/edit',
			templateUrl: 'modules/toys/views/edit-toy.client.view.html'
		});
	}
]);