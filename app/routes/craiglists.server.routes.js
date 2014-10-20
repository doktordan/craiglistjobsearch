'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users');
	var craiglists = require('../../app/controllers/craiglists');

	// Craiglists Routes
	app.route('/craiglists')
		.get(craiglists.list);

    app.param('craiglistId', craiglists.craiglistByID);
};