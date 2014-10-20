'use strict';

// Toys controller
angular.module('toys').controller('ToysController', ['$scope', '$stateParams', '$location', 'Authentication', 'Toys',
	function($scope, $stateParams, $location, Authentication, Toys ) {
		$scope.authentication = Authentication;

		// Create new Toy
		$scope.create = function() {
			// Create new Toy object
			var toy = new Toys ({
				name: this.name,
				barcode: this.barcode,
				price: this.price,
				description: this.description,
				brand: this.brand,
				imgurl: this.imgurl
			});
			// Redirect after save
			toy.$save(function(response) {
				$location.path('toys/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Toy
		$scope.remove = function( toy ) {
			if ( toy ) { toy.$remove();

				for (var i in $scope.toys ) {
					if ($scope.toys [i] === toy ) {
						$scope.toys.splice(i, 1);
					}
				}
			} else {
				$scope.toy.$remove(function() {
					$location.path('toys');
				});
			}
		};

		// Update existing Toy
		$scope.update = function() {
			var toy = $scope.toy ;

			toy.$update(function() {
				$location.path('toys/' + toy._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Toys
		$scope.find = function() {
			$scope.toys = Toys.query();
		};

		// Find existing Toy
		$scope.findOne = function() {
			$scope.toy = Toys.get({ 
				toyId: $stateParams.toyId
			});
		};
	}
]);