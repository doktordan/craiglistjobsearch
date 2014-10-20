'use strict';

(function() {
	// Toys Controller Spec
	describe('Toys Controller Tests', function() {
		// Initialize global variables
		var ToysController,
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

			// Initialize the Toys controller.
			ToysController = $controller('ToysController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Toy object fetched from XHR', inject(function(Toys) {
			// Create sample Toy using the Toys service
			var sampleToy = new Toys({
				name: 'New Toy'
			});

			// Create a sample Toys array that includes the new Toy
			var sampleToys = [sampleToy];

			// Set GET response
			$httpBackend.expectGET('toys').respond(sampleToys);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.toys).toEqualData(sampleToys);
		}));

		it('$scope.findOne() should create an array with one Toy object fetched from XHR using a toyId URL parameter', inject(function(Toys) {
			// Define a sample Toy object
			var sampleToy = new Toys({
				name: 'New Toy'
			});

			// Set the URL parameter
			$stateParams.toyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/toys\/([0-9a-fA-F]{24})$/).respond(sampleToy);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.toy).toEqualData(sampleToy);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Toys) {
			// Create a sample Toy object
			var sampleToyPostData = new Toys({
				name: 'New Toy'
			});

			// Create a sample Toy response
			var sampleToyResponse = new Toys({
				_id: '525cf20451979dea2c000001',
				name: 'New Toy'
			});

			// Fixture mock form input values
			scope.name = 'New Toy';

			// Set POST response
			$httpBackend.expectPOST('toys', sampleToyPostData).respond(sampleToyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Toy was created
			expect($location.path()).toBe('/toys/' + sampleToyResponse._id);
		}));

		it('$scope.update() should update a valid Toy', inject(function(Toys) {
			// Define a sample Toy put data
			var sampleToyPutData = new Toys({
				_id: '525cf20451979dea2c000001',
				name: 'New Toy'
			});

			// Mock Toy in scope
			scope.toy = sampleToyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/toys\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/toys/' + sampleToyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid toyId and remove the Toy from the scope', inject(function(Toys) {
			// Create new Toy object
			var sampleToy = new Toys({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Toys array and include the Toy
			scope.toys = [sampleToy];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/toys\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleToy);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.toys.length).toBe(0);
		}));
	});
}());