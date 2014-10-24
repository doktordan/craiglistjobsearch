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
  resetSearch = function(){
    document.getElementById("craiglistSearch").value = "";
    document.getElementById("craiglistGo").disabled=true;
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
        document.getElementById("craiglistSpecifics").disabled=false;
        break;
    case 3:
        document.getElementById("craiglistSearch").disabled=false;
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
    specific: this.specific
   });
   $scope.craiglists = Craiglists.get(craiglists);
   Craiglists.get(craiglists).$promise.then(
            //success
            function(results) {
              $scope.counter = Object.keys(results).length -2;
              getAllCoordinates(results).then(function(){
                 dropAllPins();
              });
              resetSearch();
            },
            //error
            function(err) {
            }
        );
  };
 }
]);


