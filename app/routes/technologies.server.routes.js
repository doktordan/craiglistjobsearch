'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var technologies = require('../../app/controllers/technologies');

	// Technologies Routes
	app.route('/technologies')
		.get(technologies.list)
		.post(users.requiresLogin, technologies.create);

	app.route('/technologies/:technologyId')
		.get(technologies.read)
		.put(users.requiresLogin, technologies.hasAuthorization, technologies.update)
		.delete(users.requiresLogin, technologies.hasAuthorization, technologies.delete);

	// Finish by binding the Technology middleware
	app.param('technologyId', technologies.technologyByID);
};