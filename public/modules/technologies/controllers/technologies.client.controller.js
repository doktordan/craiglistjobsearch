'use strict';

// Technologies controller
angular.module('technologies').controller('TechnologiesController', ['$scope', '$stateParams', '$location', 'Authentication', 'Technologies',
	function($scope, $stateParams, $location, Authentication, Technologies ) {
		$scope.authentication = Authentication;

		// Create new Technology
		$scope.create = function() {
			// Create new Technology object
			var technology = new Technologies ({
				name: this.name,
				brand: this.brand,
                description: this.description,
                image: this.image
			});

			// Redirect after save
			technology.$save(function(response) {
				$location.path('technologies/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Technology
		$scope.remove = function( technology ) {
			if ( technology ) { technology.$remove();

				for (var i in $scope.technologies ) {
					if ($scope.technologies [i] === technology ) {
						$scope.technologies.splice(i, 1);
					}
				}
			} else {
				$scope.technology.$remove(function() {
					$location.path('technologies');
				});
			}
		};

		// Update existing Technology
		$scope.update = function() {
			var technology = $scope.technology ;

			technology.$update(function() {
				$location.path('technologies/' + technology._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Technologies
		$scope.find = function() {
			$scope.technologies = Technologies.query();
		};

		// Find existing Technology
		$scope.findOne = function() {
			$scope.technology = Technologies.get({ 
				technologyId: $stateParams.technologyId
			});
		};
	}
]);