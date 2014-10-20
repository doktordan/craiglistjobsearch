'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Toy = mongoose.model('Toy'),
	_ = require('lodash');

/**
 * Create a Toy
 */
exports.create = function(req, res) {
	var toy = new Toy(req.body);
	toy.user = req.user;

	toy.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(toy);
		}
	});
};

/**
 * Show the current Toy
 */
exports.read = function(req, res) {
	res.jsonp(req.toy);
};

/**
 * Update a Toy
 */
exports.update = function(req, res) {
	var toy = req.toy ;

	toy = _.extend(toy , req.body);

	toy.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(toy);
		}
	});
};

/**
 * Delete an Toy
 */
exports.delete = function(req, res) {
	var toy = req.toy ;

	toy.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(toy);
		}
	});
};

/**
 * List of Toys
 */
exports.list = function(req, res) { Toy.find().sort('-created').populate('user', 'displayName').exec(function(err, toys) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(toys);
		}
	});
};

/**
 * Toy middleware
 */
exports.toyByID = function(req, res, next, id) { Toy.findById(id).populate('user', 'displayName').exec(function(err, toy) {
		if (err) return next(err);
		if (! toy) return next(new Error('Failed to load Toy ' + id));
		req.toy = toy ;
		next();
	});
};

/**
 * Toy authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.toy.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};