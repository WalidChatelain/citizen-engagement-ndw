angular.module('citizen-engagement')
    .controller('GeolocService', function (geolocation, $log) {
        var service = {

            locateUser: function () {

                return geolocation.getLocation().then(function (data) {
                    
                    return data.coords;


                }, function (error) {
                    $log.error("Could not get location: " + error);
                    console.log("Could not get location: " + error);
                });

            }
        };

        return service;
    })

    .controller("IssuesMapCtrl", function($scope, mapboxMapId, mapboxAccessToken, $http, apiUrl, GeolocService) {
        var mapboxTileLayer = "http://api.tiles.mapbox.com/v4/" + mapboxMapId;
        mapboxTileLayer = mapboxTileLayer + "/{z}/{x}/{y}.png?access_token=" + mapboxAccessToken;
        $scope.mapDefaults = {
            tileLayer: mapboxTileLayer
        };
        $scope.mapCenter = {};
        $scope.mapMarkers = [];
        GeolocService.locateUser().then(function (coords) {
            $scope.mapCenter = {
                lat: coords.latitude,
                lng: coords.longitude,
                zoom: 15
            };
                $scope.mapMarkers.push({
                    lat: coords.latitude,
                    lng: coords.longitude,
                    message: '<p>Here </p>',
                    getMessageScope: function() {
                        var scope = $scope.$new();
                        scope.issue = issue;
                        return scope;
                    }
                });
        });


        $http({
            method: 'GET',
            url: apiUrl + '/issues',
        }).success(function(issues) {
            angular.forEach(issues, function(issue) {
                $scope.mapMarkers.push({
                    lat: issue.lat,
                    lng: issue.lng,
                    message: '<p>{{issue.description}}</p><img src="{{issue.imageUrl}}" width="200px"/>',
                    getMessageScope: function() {
                        var scope = $scope.$new();
                        scope.issue = issue;
                        return scope;
                    }
                });
            });
        });
    })