'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Technology = mongoose.model('Technology'),
	_ = require('lodash');

/**
 * Create a Technology
 */
exports.create = function(req, res) {
	var technology = new Technology(req.body);
	technology.user = req.user;

	technology.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(technology);
		}
	});
};

/**
 * Show the current Technology
 */
exports.read = function(req, res) {
	res.jsonp(req.technology);
};

/**
 * Update a Technology
 */
exports.update = function(req, res) {
	var technology = req.technology ;

	technology = _.extend(technology , req.body);

	technology.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(technology);
		}
	});
};

/**
 * Delete an Technology
 */
exports.delete = function(req, res) {
	var technology = req.technology ;

	technology.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(technology);
		}
	});
};

/**
 * List of Technologies
 */
exports.list = function(req, res) { Technology.find().sort('-created').populate('user', 'displayName').exec(function(err, technologies) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(technologies);
		}
	});
};

/**
 * Technology middleware
 */
exports.technologyByID = function(req, res, next, id) { Technology.findById(id).populate('user', 'displayName').exec(function(err, technology) {
		if (err) return next(err);
		if (! technology) return next(new Error('Failed to load Technology ' + id));
		req.technology = technology ;
		next();
	});
};

/**
 * Technology authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.technology.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};