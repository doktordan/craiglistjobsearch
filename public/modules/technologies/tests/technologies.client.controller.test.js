'use strict';

(function() {
	// Technologies Controller Spec
	describe('Technologies Controller Tests', function() {
		// Initialize global variables
		var TechnologiesController,
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

			// Initialize the Technologies controller.
			TechnologiesController = $controller('TechnologiesController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Technology object fetched from XHR', inject(function(Technologies) {
			// Create sample Technology using the Technologies service
			var sampleTechnology = new Technologies({
				name: 'New Technology'
			});

			// Create a sample Technologies array that includes the new Technology
			var sampleTechnologies = [sampleTechnology];

			// Set GET response
			$httpBackend.expectGET('technologies').respond(sampleTechnologies);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.technologies).toEqualData(sampleTechnologies);
		}));

		it('$scope.findOne() should create an array with one Technology object fetched from XHR using a technologyId URL parameter', inject(function(Technologies) {
			// Define a sample Technology object
			var sampleTechnology = new Technologies({
				name: 'New Technology'
			});

			// Set the URL parameter
			$stateParams.technologyId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/technologies\/([0-9a-fA-F]{24})$/).respond(sampleTechnology);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.technology).toEqualData(sampleTechnology);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Technologies) {
			// Create a sample Technology object
			var sampleTechnologyPostData = new Technologies({
				name: 'New Technology'
			});

			// Create a sample Technology response
			var sampleTechnologyResponse = new Technologies({
				_id: '525cf20451979dea2c000001',
				name: 'New Technology'
			});

			// Fixture mock form input values
			scope.name = 'New Technology';

			// Set POST response
			$httpBackend.expectPOST('technologies', sampleTechnologyPostData).respond(sampleTechnologyResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Technology was created
			expect($location.path()).toBe('/technologies/' + sampleTechnologyResponse._id);
		}));

		it('$scope.update() should update a valid Technology', inject(function(Technologies) {
			// Define a sample Technology put data
			var sampleTechnologyPutData = new Technologies({
				_id: '525cf20451979dea2c000001',
				name: 'New Technology'
			});

			// Mock Technology in scope
			scope.technology = sampleTechnologyPutData;

			// Set PUT response
			$httpBackend.expectPUT(/technologies\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/technologies/' + sampleTechnologyPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid technologyId and remove the Technology from the scope', inject(function(Technologies) {
			// Create new Technology object
			var sampleTechnology = new Technologies({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Technologies array and include the Technology
			scope.technologies = [sampleTechnology];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/technologies\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleTechnology);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.technologies.length).toBe(0);
		}));
	});
}());