'use strict';

/**
 * Module dependencies.
 */
var should = require('should'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Toy = mongoose.model('Toy');

/**
 * Globals
 */
var user, toy;

/**
 * Unit tests
 */
describe('Toy Model Unit Tests:', function() {
	beforeEach(function(done) {
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: 'username',
			password: 'password'
		});

		user.save(function() { 
			toy = new Toy({
				name: 'Toy Name',
				barcode: 'Toy Barcode',
				price: 'Toy Price',
				description: 'Toy Description',
				brand: 'Toy Brand',
				user: user
			});

			done();
		});
	});

	describe('Method Save', function() {
		it('should be able to save without problems', function(done) {
			return toy.save(function(err) {
				should.not.exist(err);
				done();
			});
		});

		it('should be able to show an error when try to save without name', function(done) { 
			toy.name = '';

			return toy.save(function(err) {
				should.exist(err);
				done();
			});
		});
	});

	afterEach(function(done) { 
		Toy.remove().exec();
		User.remove().exec();

		done();
	});
});