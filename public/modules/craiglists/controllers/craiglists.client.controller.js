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
          $window.open(titles[me][1]);
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
    removeAllPins = function(){
       for (var i = 0; i < neighborhoods.length; i++) {
            markers[i].setMap(null);
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
    getCityName = function(){
        var city = document.getElementById("craiglistCities").options[document.getElementById("craiglistCities").selectedIndex].value;
        return city;
    },
    getCities = function(){
      var cities = new Craiglists ({
        getcities: true
       });
        Craiglists.get(cities).$promise.then(
            //success
            function(results) {
              $scope.cityScap = results;
             document.getElementById("message").innerHTML = "";
            },
            //error
            function(err) {
            }
        );
   },
    getSpecifics = function(element){
      alert('getSpecifics');
      var city = getCityName(),
      specifics = new Craiglists ({
          getspecifics:true,
          selectingElement:element,
          city:city
       });
      Craiglists.get(specifics).$promise.then(
        function(results) {
          $scope.jobScap = results;
          document.getElementById("message").innerHTML = "";
        },
        function(err) {
        }
      );
    },
    getJobs = function(){
      alert('getJobs');
      var jobs = new Craiglists ({
          getjobs:true
       });
        Craiglists.get(jobs).$promise.then(
              function(results) {
                $scope.jobScap = results;
              },
              function(err) {
              }
        );
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
  };
  $scope.userTyped = function(commen){
    if (this.search!=undefined){
          if(this.search.length > 0){
              document.getElementById(commen).disabled=false;
          }else{
              document.getElementById(commen).disabled=true;
          }
    }
  };
  $scope.enableMe = function(selector){
    switch(selector) {
    case 1:
        document.getElementById("craiglistSections").disabled=false;
        break;
    case 2:
        $scope.jobScap = {}; // basically, remove element pasing empty json
        document.getElementById("craiglistSearch").disabled=false;
        document.getElementById("craiglistGo").disabled=false;
    break;
    }
  };
  $scope.getSelectors = function(selector){
    document.getElementById("message").innerHTML = "Loading Specific";
    switch(this.type){
      case "Jobs":
          getSpecifics('#jjj0');
          break;
      case "Sale":
          getSpecifics('#sss0,#sss1');
          break;
      default: 
        $scope.enableMe(3);
        break;
    }
    $scope.enableMe(selector);
   };
  $scope.initialize = function(){
    drawMap();
    getCities();
  };  

  $scope.scrap = function() {
    var city = getCityName(),
    craiglists = new Craiglists ({
      city: city,
      search: this.search,
      specific: $scope.array
    });
    console.log(craiglists);
   //$scope.craiglists = Craiglists.get(craiglists);
   Craiglists.get(craiglists).$promise.then(
            //success
            function(results) {
              console.log(results);
              $scope.craiglists = Craiglists.get(craiglists);
              removeAllPins();
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


  $scope.array = [];


 }
]).filter("toArray", function(){
    return function(obj) {
        var result = [];
        angular.forEach(obj, function(val, key) {
            result.push(val);
        });
        return result;
    };
}).directive("checkboxGroup", function () {
    return {
        restrict: "A",
        link: function (scope, elem, attrs) {
            // Determine initial checked boxes
            if (scope.array.indexOf(scope.job.href) !== -1) {
                elem[0].checked = true;
            }

            // Update array on click
            elem.bind('click', function () {
                var index = scope.array.indexOf(scope.job.href);
                // Add if checked
                if (elem[0].checked) {
                    if (index === -1) scope.array.push(scope.job.href);
                }
                // Remove if unchecked
                else {
                    if (index !== -1) scope.array.splice(index, 1);
                }
                // Sort and update DOM display
                scope.$apply(scope.array.sort(function (a, b) {
                    return a - b
                }));
                console.log(scope.array);
            });
        }
    }
});

