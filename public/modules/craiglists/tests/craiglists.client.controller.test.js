'use strict';

(function() {
	// Craiglists Controller Spec
	describe('Craiglists Controller Tests', function() {
		// Initialize global variables
		var CraiglistsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Craiglists controller.
			CraiglistsController = $controller('CraiglistsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Craiglist object fetched from XHR', inject(function(Craiglists) {
			// Create sample Craiglist using the Craiglists service
			var sampleCraiglist = new Craiglists({
				name: 'New Craiglist'
			});

			// Create a sample Craiglists array that includes the new Craiglist
			var sampleCraiglists = [sampleCraiglist];

			// Set GET response
			$httpBackend.expectGET('craiglists').respond(sampleCraiglists);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.craiglists).toEqualData(sampleCraiglists);
		}));

		it('$scope.findOne() should create an array with one Craiglist object fetched from XHR using a craiglistId URL parameter', inject(function(Craiglists) {
			// Define a sample Craiglist object
			var sampleCraiglist = new Craiglists({
				name: 'New Craiglist'
			});

			// Set the URL parameter
			$stateParams.craiglistId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/craiglists\/([0-9a-fA-F]{24})$/).respond(sampleCraiglist);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.craiglist).toEqualData(sampleCraiglist);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Craiglists) {
			// Create a sample Craiglist object
			var sampleCraiglistPostData = new Craiglists({
				name: 'New Craiglist'
			});

			// Create a sample Craiglist response
			var sampleCraiglistResponse = new Craiglists({
				_id: '525cf20451979dea2c000001',
				name: 'New Craiglist'
			});

			// Fixture mock form input values
			scope.name = 'New Craiglist';

			// Set POST response
			$httpBackend.expectPOST('craiglists', sampleCraiglistPostData).respond(sampleCraiglistResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Craiglist was created
			expect($location.path()).toBe('/craiglists/' + sampleCraiglistResponse._id);
		}));

		it('$scope.update() should update a valid Craiglist', inject(function(Craiglists) {
			// Define a sample Craiglist put data
			var sampleCraiglistPutData = new Craiglists({
				_id: '525cf20451979dea2c000001',
				name: 'New Craiglist'
			});

			// Mock Craiglist in scope
			scope.craiglist = sampleCraiglistPutData;

			// Set PUT response
			$httpBackend.expectPUT(/craiglists\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/craiglists/' + sampleCraiglistPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid craiglistId and remove the Craiglist from the scope', inject(function(Craiglists) {
			// Create new Craiglist object
			var sampleCraiglist = new Craiglists({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Craiglists array and include the Craiglist
			scope.craiglists = [sampleCraiglist];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/craiglists\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleCraiglist);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.craiglists.length).toBe(0);
		}));
	});
}());