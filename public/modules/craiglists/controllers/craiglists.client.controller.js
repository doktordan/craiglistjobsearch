'use strict';

// Craiglists controller
angular.module('craiglists').controller('CraiglistsController', ['$window','$q','$element', '$resource', '$http', '$scope', '$stateParams', '$location', 'Authentication', 'Craiglists',
 function($window,$q,$element, $resource, $http, $scope, $stateParams, $location, Authentication, Craiglists ) {
  $scope.authentication = Authentication;
    var geocoder =  new google.maps.Geocoder(),
    map,
    neighborhoods = [],
    titles = [],
    markers = [],
    iterator = 0,
    counter = 0,
    counter1 = 0,
    mapOptions,
    latlng,
    addMarker = function() {
        markers.push(new google.maps.Marker({
          position: neighborhoods[iterator],
          map: map,
          draggable: false,
          animation: google.maps.Animation.DROP
        }));
        //console.log(titles[iterator])
        markers[iterator].setTitle(titles[iterator][0]);
        google.maps.event.addListener(markers[iterator], 'click', function() {
          var me = markers.indexOf(this);
          $window.open(titles[me][1])
        //  addInfoWindow(this,this.title)
        });
        iterator++;
      },
    addInfoWindow =function(marker, message) {
            var info = message;

            var infoWindow = new google.maps.InfoWindow({
                content: message
            });

            google.maps.event.addListener(marker, 'click', function () {
                infoWindow.open(map, marker);
            });
        },
    dropAllPins = function() {
          for (var i = 0; i < neighborhoods.length; i++) {
            setTimeout(function() {
              addMarker();
            }, i * 200);
          }
    },
    getAllCoordinates = function(results){
      var deferred = $q.defer();
        angular.forEach(results, function(value, key) {
          if (value.location){
              counter++;
              getCoordinate(value.location).then(function(){
                titles.push([value.title,value.url]);
                if (counter==counter1){
                  deferred.resolve();
                }
              });
          }
         });
      return deferred.promise;
    },
    getCoordinate = function(loc) {
        var deferred = $q.defer();
        geocoder = new google.maps.Geocoder();
        geocoder.geocode( { 'address': loc}, function(results, status) {
          if (status === google.maps.GeocoderStatus.OK) {
            neighborhoods.push(results[0].geometry.location);
            counter1++;
            deferred.resolve();
          } else {
            console.log('Geocode was not successful for the following reason: ' + status);
            counter1++;
          }
        });
        return deferred.promise;
  },
  drawMap = function(){
            geocoder = new google.maps.Geocoder();
        latlng = new google.maps.LatLng(37.09024, -95.712891);
        mapOptions = {
          zoom: 4,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
  },
  getJobs = function(){
    var jobs = new Craiglists ({
      getjobs: true
     });
      Craiglists.get(jobs).$promise.then(
            //success
            function(results) {
              console.log(results);
            },
            //error
            function(err) {
            }
        );
   },
  getCities = function(){
    var cities = new Craiglists ({
      getcities: true
     });
      Craiglists.get(cities).$promise.then(
            //success
            function(results) {
              $scope.cityScap = results;
             document.getElementById("message").innerHTML = "Select a City";
            },
            //error
            function(err) {
            }
        );
   };
  $scope.initialize = function(){
    drawMap();
    getCities();
  //  getJobs();
  };  
  $scope.scrap = function() {
   var craiglists = new Craiglists ({
    city: this.city,
    search: this.search,
    type: this.type
   });
   $scope.craiglists = Craiglists.get(craiglists);
   Craiglists.get(craiglists).$promise.then(
            //success
            function(results) {
              $scope.counter = Object.keys(results).length -2;
              getAllCoordinates(results).then(function(){
                 dropAllPins();
              });
            },
            //error
            function(err) {
            }
        );
  };
 }
]);


