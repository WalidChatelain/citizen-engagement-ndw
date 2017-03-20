angular.module('citizen-engagement')

.controller("allIssuesCtrl", function($scope, $http, apiUrl) {

    $scope.noMoreItemsAvailable = false;
    $scope.issues = [];
    
    var i = 0;
    var currentPage = 0;
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
        //$scope.loadIssueTypesFilter();
    };




})

    .controller("issueCtrl", function($scope, $http, apiUrl, $stateParams, $cookies) {

        //var issueCtrl = this;
        var issueId = $stateParams.issueId;
        $scope.comments = [];
        //var issueTypeName = $stateParams.issueTypeHref;
        $scope.userIsStaff = false;
        var userRoleLogged = $cookies.get('userRole');
        console.log(userRoleLogged);
        
        //console.log(userRoleLogged);
        $scope.noMoreCommentsAvailable = false;
        $scope.seeCommentsClick = false;
        var j = 0;
        var currentPageComments = 0;

        console.log('helllo');
        
        $scope.issue = {};
        $scope.comment = {};
        $scope.data = {};
        $scope.action = {};
        $scope.issueType = {};

        $http({
            method: 'GET',
            url: apiUrl + '/issueTypes/'
        }).success(function (issueTypes) {
            $scope.issueTypes = issueTypes;
            console.log($scope.issueTypes);
        });

        //console.log($scope.issueTypeSelected);

        //var string = "foo",
        //var string = "foo",
        var substring = "staff";
       // console.log(userRoleLogged.includes(substring));
        if (userRoleLogged.indexOf(substring)>=0){
            $scope.userIsStaff = true;  
        }
        //console.log($scope.userIsStaff);
        //var seeCommentsClick = false;
        //console.log(issueType);
        $http({
            method: 'GET',
            url: apiUrl + '/issues/'+issueId+'?include=issueType'
        }).success(function(issue) {
            $scope.issue = issue;
        }).catch(function() {
            // If an error occurs, hide the loading message and show an error message.
            $scope.error = 'Can not get the issues';
        });


         $scope.seeComments = function() {
           $scope.seeCommentsClick = true;
            //console.log(issueId);
            
            $http({
                method: 'GET',
                url: apiUrl + '/issues/'+issueId+'/comments?include=author&page='+ currentPageComments +'&pageSize=50'
            }).success(function(comments) {
                //$scope.comments = $scope.comments.concat(comments);
                // Pour tester, il y a des commentaires ---> 58ca91368af7620011485cc6
                //console.log(currentPageComments);
                //console.log($scope.noMoreCommentsAvailable);
                //console.log($scope.seeCommentsClick);
                $scope.comments = comments;
                console.log(comments.length);

                currentPageComments++;

                if (j == 2 || comments.length < 50) {
                $scope.noMoreCommentsAvailable = true;
                }
                j++;
                
                $scope.$broadcast('scroll.infiniteScrollComplete');

            }).catch(function() {
                // If an error occurs, hide the loading message and show an error message.
                $scope.error = 'Can not get the comments';
            });  
  
        };

        $scope.postComments = function() {

            //console.log(issueId);
            $http({
                method: 'POST',
                url: apiUrl + '/issues/'+issueId+'/comments',
                data: $scope.comment
            }).success(function(comments) {
                console.log('bordel');
            });
  
        };

        $scope.manageIssues = function (){

            var issueState =  $scope.issue.state;

            if(issueState == "new" && $scope.action.type == "start"){

                $http({
                method: 'POST',
                url: apiUrl + '/issues/'+issueId+'/actions',
                data: $scope.action
                }).success(function(actions) {
     
                });
                
            }else if ((issueState == "new" || issueState == "inProgress") && $scope.action.type == "reject"){
                $http({
                method: 'POST',
                url: apiUrl + '/issues/'+issueId+'/actions',
                data: $scope.action
                }).success(function(actions) {
     
                });
            }else if (issueState == "inProgress" && $scope.action.type == "resolve"){

                $http({
                method: 'POST',
                url: apiUrl + '/issues/'+issueId+'/actions',
                data: $scope.action
                }).success(function(actions) {
      
                });


            }else{
                console.log('Vous ne respectez pas les conditions de transition des états');
            }
       
           
        };

        $scope.addIssueType = function (){
            $http({
                method: 'POST',
                url: apiUrl + '/issueTypes/',
                data: $scope.issueType
                }).success(function(issueTypes) {
                    console.log('issueTypePossssstée');
                });

        };

        //$scope.issue.issueTypeHref = $scope.selectedType;
        //console.log($scope.selected);

        $scope.deleteIssueType = function (){
            //console.log($scope);
            //$scope.issue.issueTypeHref = $scope.selectedType;
            console.log($scope.data.selectedType);
            $http({
                method: 'DELETE',
                url: apiUrl + '/issueTypes/' + $scope.data.selectedType
                //data: issueCtrl.issueType
                }).success(function(issueTypes) {
                    console.log('issuetypeSupprimée');
                });

        };

        
    });


angular.module('citizen-engagement').controller('newIssueCtrl', function(geolocation, $q, $log, $scope, $http, $state, apiUrl, qimgUrl, qimgSecret, $ionicPopup, CameraService) {

          $scope.loadIssueTypes = function () {
                $scope.issue = {};
                    $http({
                        method: 'GET',
                        url: apiUrl + '/issueTypes/'
                    }).success(function (issueTypes) {

                $scope.issueTypes = issueTypes;

                geolocation.getLocation().then(function(data){

                    var coor = [data.coords.latitude, data.coords.longitude];

                    $scope.issue.location = {
                        type: 'Point',
                        coordinates: coor
                    };
                    
                }).catch(function(err) {
                    $log.error('Could not get location because: ' + err.message);
                });
            })

          };


            $scope.loadIssueTypes();
            $scope.submit = function () {
                console.log($scope.selected);
                return postImage().then(postIssue).then(function() {
                  $state.go("app.home");
                  return $ionicPopup.alert({
                  title: 'Issue created',
                  template: 'Successfuly created'
                  });
                });
            };

          function postImage() {
            if (!$scope.pictureData) {
              // If no image was taken, return a promise resolved with "null"
              return $q.when(null);
            }

            // Upload the image to the qimg API
            return $http({
              method: 'POST',
              url: qimgUrl + '/images',
              headers: {
                Authorization: 'Bearer ' + qimgSecret
              },
              data: {
                data: $scope.pictureData
              }
            });
          }
        function postIssue(imageRes) {

        // Use the image URL from the qimg API response (if any)
        if (imageRes) {
          $scope.issue.imageUrl = imageRes.data.url;
        }

        // Create the issue
        $scope.issue.issueTypeHref = $scope.selected;
            return $http({
                  method: 'POST',
                  url: apiUrl + '/issues/',
                  data: $scope.issue

              }).success(function(res) {
                  console.log(res);
          })
        }


        $scope.takePicture = function() {
          if (!CameraService.isSupported()) {
            return $ionicPopup.alert({
              title: 'Not supported',
              template: 'You cannot use the camera on this platform'
            });
          }

          CameraService.getPicture({ quality: 50}).then(function(result) {
            $log.debug('Picture taken!');
            $scope.pictureData = result;
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


