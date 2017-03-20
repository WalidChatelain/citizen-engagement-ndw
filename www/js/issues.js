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


angular.module('citizen-engagement').controller('newIssueCtrl', function(geolocation, $log, $scope, $http, apiUrl, $ionicPopup, CameraService) {
  var newIssueCtrl = this;
  $scope.loadIssueTypes = function () {
    $scope.issue = {};
    $http({
      method: 'GET',
      url: apiUrl + '/issueTypes/'
    }).success(function (issueTypes) {
      $scope.issueTypes = issueTypes;
    });
  }
  $scope.loadIssueTypes();
  geolocation.getLocation().then(function(data){
    newIssueCtrl.latitude = data.coords.latitude;
    newIssueCtrl.longitude = data.coords.longitude;
  }).catch(function(err) {
    $log.error('Could not get location because: ' + err.message);
  });

  newIssueCtrl.takePicture = function() {
    if (!CameraService.isSupported()) {
      return $ionicPopup.alert({
        title: 'Not supported',
        template: 'You cannot use the camera on this platform'
      });
    }

    CameraService.getPicture().then(function(result) {
      $log.debug('Picture taken!');
      newIssueCtrl.pictureData = result;
    }).catch(function(err) {
      $log.error('Could not get picture because: ' + err.message);
    });
  };
});

angular.module('citizen-engagement').controller('MapCtrl', function($scope, mapboxSecret) {
  var mapCtrl = this;
  var record = {
    title: 'Lorem ipsum'
  };
  var mapboxMapId = 'mapbox.satellite';
  var mapboxAccessToken = mapboxSecret;

  var mapboxTileLayerUrl = 'http://api.tiles.mapbox.com/v4/' + mapboxMapId;
  mapboxTileLayerUrl = mapboxTileLayerUrl + '/{z}/{x}/{y}.png';
  mapboxTileLayerUrl = mapboxTileLayerUrl + '?access_token=' + mapboxAccessToken;

  $scope.$on('leafletDirectiveMap.dragend', function(event, map){
    console.log('Map was dragged');
  });
  $scope.$on('leafletDirectiveMarker.click', function(event, marker) {
    var coords = marker.model.lng + '/' + marker.model.lat;
    console.log('Marker at ' + coords + ' was clicked');
  });

  mapCtrl.defaults = {
    tileLayer: mapboxTileLayerUrl
  };

  mapCtrl.markers=[];
  mapCtrl.center = {
    lat: 51.48,
    lng: 0,
    zoom: 14
  };
  mapCtrl.markers.push({
    lat: 51.48,
    lng: 0,
    icon: {
      iconUrl: 'img/location2.png',
      iconSize: [40, 50]
    },
    message: '<div ng-include="\'templates/message.html\'"/"/>',
    getMessageScope: function() {
      var scope = $scope.$new();
      scope.record = record;
      return scope;
    }
  });
});

angular.module('citizen-engagement').factory('CameraService', function($q) {
  var service = {
    isSupported: function() {
      return navigator.camera !== undefined;
    },
    getPicture: function() {
      var deferred = $q.defer();
      var options = { // Return the raw base64 PNG data
        destinationType: navigator.camera.DestinationType.DATA_URL,
        correctOrientation: true
      };
      navigator.camera.getPicture(function(result) {
        deferred.resolve(result);
      }, function(err) {
        deferred.reject(err);
      }, options);
      return deferred.promise;
    }
  };
  return service;
});
