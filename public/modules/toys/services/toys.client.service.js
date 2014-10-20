'use strict';

//Toys service used to communicate Toys REST endpoints
angular.module('toys').factory('Toys', ['$resource',
	function($resource) {
		return $resource('toys/:toyId', { toyId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);