'use strict';

//Setting up route
angular.module('craiglists').config(['$stateProvider',
	function($stateProvider) {
		// Craiglists state routing
		$stateProvider.
		state('searchCraiglists', {
			url: '/craiglists',
			templateUrl: 'modules/craiglists/views/search-craiglist.client.view.html'
		});
	}
]);