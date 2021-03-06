'use strict';
var mongoose = require('mongoose'),
  errorHandler = require('./errors'),
  Craiglist = mongoose.model('Craiglist'),
  _ = require('lodash'),


toObject= function(arr) {
  var rv = {};
  for (var i = 0; i < arr.length; ++i)
    rv[i] = arr[i];
  return rv;
},

searchCraiglist = function(req,res){
  var craigslist = require('node-craigslist'),
  city = req.param('city'),
   specific = req.param('specific'),
   search = req.param('search'),
   clist = craigslist({
    city : city
  }),
  options = {type:specific},
  listings = [];
  clist.search(options, search, function (err, listings) {
   listings.forEach(function (listing) {
    listing.city = city;
    var url = listing.url;
    listings.push(listing);
   });
   res.jsonp({allSearches:toObject(listings)});
  });
},

getCities = function(req,res) {
  var craigslist = require('node-craigslist'),
   options = {cities:true},
   citylist = craigslist({test:'test'}),
  cities = [];
  citylist.search(options, '', function (err, cities) {
  cities.forEach(function (city) {
    cities.city = city;
    //var url = listing.url;
   cities.push(city);
  });
   res.jsonp(toObject(cities));
  });
},
getJobs = function(req,res) {
  var craigslist = require('node-craigslist'),
   options = {jobs:true},
   city = req.param('city'),
   joblist = craigslist({
    city : city
  }),
  jobs = [];
  joblist.search(options, '', function (err, jobs) {
  jobs.forEach(function (job) {
    jobs.job = job;
   jobs.push(job);
  });
   res.jsonp(toObject(jobs));
  });
},
getSpecifics = function(req,res) {
  var craigslist = require('node-craigslist'),
      city = req.param('city'),
      options = {
      specifics:true,
      element:req.param('selectingElement'),
      city:city},
      specificlist = craigslist({}),
    aspecifics = [];
    specificlist.search(options, '', function (err, aspecifics) {
      // scraping return a complet json, we don't need push data again
      /*
      aspecifics.forEach(function (specific) {
        aspecifics.specific = specific;
        aspecifics.push(specific);
      });
      */
     res.jsonp(toObject(aspecifics));
    });
};
exports.list = function(req, res) {
  if (req.param('getcities')){
    getCities(req,res);
  }
  else if (req.param('getspecifics')){
    getSpecifics(req,res);
  }else{
    searchCraiglist(req,res);
  }
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