'use strict';
var mongoose = require('mongoose'),
	errorHandler = require('./errors'),
	Craiglist = mongoose.model('Craiglist'),
	_ = require('lodash');


function toObject(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
}

exports.list = function(req, res) {
  var craigslist = require('node-craigslist'),
   city = req.param('city'),
   types = req.param('type'),
   search = req.param('search'),
   clist = craigslist({
    city : city
  }),
  options = {type:types};
  var listings = [];
  clist.search(options, search, function (err, listings) {
   listings.forEach(function (listing) {
    listing.city = city;
    var url = listing.url;
    listings.push(listing);
   });
   res.jsonp(toObject(listings));
  });
};

/**
 * Connect with Craiglists
 */
exports.connect = function(req, res) {
 console.log('backend');
};


/**
 * Craiglist middleware
 */
exports.craiglistByID = function(req, res, next, id) {};

/**
 * Craiglist authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
 if (req.craiglist.user.id !== req.user.id) {
  return res.status(403).send('User is not authorized');
 }
 next();
};