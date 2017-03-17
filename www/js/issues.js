angular.module('citizen-engagement')

.controller("allIssuesCtrl", function($scope, $http, apiUrl) {

    $scope.noMoreItemsAvailable = false;
    $scope.issues = [];
    var i = 0;
    var currentPage = 0

    //console.log('controller');
    $scope.loadMore = function() {
        //console.log('load more');

        i++;
        $http({
            method: 'GET',
            url: apiUrl + '/issues?include=issueType&page=' + currentPage
        }).success(function(issues) {
            $scope.issues = $scope.issues.concat(issues);
        });

        currentPage++;

        if ( i == 100 ) {
            $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };
})

    .controller("issueCtrl", function($scope, $http, apiUrl, $stateParams) {
        var issueId = $stateParams.issueId;
        var issueTypeName = $stateParams.issueTypeHref;
        //console.log(issueType);
        $http({
            method: 'GET',
            url: apiUrl + '/issues/'+issueId+'?include=issueType'
        }).success(function(issue) {

            $scope.issue = issue;

        });

})

    /*.controller("newIssueCtrl", function($scope, $http, apiUrl, $stateParams, GeolocService){
        $scope.loadIssueTypes = function () {
            $scope.issue = {};
            $http({
                method: 'GET',
                url: apiUrl + '/issueTypes/'
            }).success(function (issueTypes) {
                $scope.issueTypes = issueTypes;
                GeolocService.locateUser().then(function (coords) {
                    console.log(coords);
                    $scope.issue.lng = coords.longitude;
                    $scope.issue.lat = coords.latitude;
                });
            });
        };
        $scope.loadIssueTypes();
        $scope.submit = function () {
            $scope.issue.imgUrl = "http://cliparts.co/cliparts/8c6/oAK/8c6oAKjri.png";
            console.log($scope.issue);
            $http.post(apiUrl + '/issues/', $scope.issue).success(function(res) {
                console.log(res);
            })
        };
        });*/

        angular.module('citizen-engagement').controller('NewIssueCtrl', function(geolocation, $log) {
          var newIssueCtrl = this;

          geolocation.getLocation().then(function(data){
            newIssueCtrl.latitude = data.coords.latitude;
            newIssueCtrl.longitude = data.coords.longitude;
          }).catch(function(err) {
            $log.error('Could not get location because: ' + err.message);
          });
        });

        angular.module('citizen-engagement').controller('MapCtrl', function() {
          var mapCtrl = this;
          mapCtrl.defaults = {};
          mapCtrl.markers=[];
          mapCtrl.center = {
            lat: 51.48,
            lng: 0,
            zoom: 14
          };
          mapCtrl.markers.push({
            lat: 51.48,
            lng: 0,
            message:'hello world'
          });
        });

        //DEVRAIT ETRE DANS MAP.JS
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