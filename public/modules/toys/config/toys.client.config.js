'use strict';

// Configuring the Articles module
angular.module('toys').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Toys', 'toys', 'dropdown', '/toys(/create)?');
		Menus.addSubMenuItem('topbar', 'toys', 'List Toys', 'toys');
		Menus.addSubMenuItem('topbar', 'toys', 'New Toy', 'toys/create');
	}
]);