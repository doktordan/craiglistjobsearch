'use strict';

//Technologies service used to communicate Technologies REST endpoints
angular.module('technologies').factory('Technologies', ['$resource',
	function($resource) {
		return $resource('technologies/:technologyId', { technologyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);