'use strict';

//Craiglists service used to communicate Craiglists REST endpoints
angular.module('craiglists').factory('Craiglists', ['$resource',
	function($resource) {
		return $resource('craiglists/:craiglistId', { craiglistId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);