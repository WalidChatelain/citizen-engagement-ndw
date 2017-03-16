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