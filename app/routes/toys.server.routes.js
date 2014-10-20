'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var toys = require('../../app/controllers/toys');

	// Toys Routes
	app.route('/toys')
		.get(toys.list)
		.post(users.requiresLogin, toys.create);

	app.route('/toys/:toyId')
		.get(toys.read)
		.put(users.requiresLogin, toys.hasAuthorization, toys.update)
		.delete(users.requiresLogin, toys.hasAuthorization, toys.delete);

	// Finish by binding the Toy middleware
	app.param('toyId', toys.toyByID);
};