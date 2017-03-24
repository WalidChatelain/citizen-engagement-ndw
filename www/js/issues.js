angular.module('citizen-engagement')

// Controller permettant de loader toutes les issues 
.controller("allIssuesCtrl", function($scope, $http, apiUrl) {

    $scope.noMoreItemsAvailable = false;
    $scope.issues = [];
    
    var i = 0;
    var currentPage = 0;

    $scope.loadMore = function() {
        i++;
        $http({
            method: 'GET',
            url: apiUrl + '/issues?include=issueType&page=' + currentPage
        }).success(function(issues) {
            $scope.issues = $scope.issues.concat(issues);
        }).catch(function() {
            $scope.error = 'Could not get the issues';
        });

        currentPage++;

        if ( i == 100 ) {
            $scope.noMoreItemsAvailable = true;
        }
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };




})

// Controller permettant de géréer les détails des issues
.controller("issueCtrl", function($scope, $http, apiUrl, $stateParams, $cookies, $ionicPopup) {

    var issueId = $stateParams.issueId;
    $scope.comments = [];
    $scope.userIsStaff = false;
    var userRoleLogged = $cookies.get('userRole');
    console.log(userRoleLogged);
    
    $scope.noMoreCommentsAvailable = false;
    $scope.seeCommentsClick = false;
    var j = 0;
    var currentPageComments = 0;

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

    var substring = "staff";
    if (userRoleLogged.indexOf(substring)>=0){
        $scope.userIsStaff = true;  
    }

    $http({
        method: 'GET',
        url: apiUrl + '/issues/'+issueId+'?include=issueType'
    }).success(function(issue) {
        $scope.issue = issue;
    }).catch(function() {
        // If an error occurs, hide the loading message and show an error message.
        $scope.error = 'Can not get the issues';
    });

    // Fonction appelée lorsqu'on clique sur le bouton see comments dans les issueDetails
     $scope.seeComments = function() {
       $scope.seeCommentsClick = true;
        $http({
            method: 'GET',
            url: apiUrl + '/issues/'+issueId+'/comments?include=author&page='+ currentPageComments +'&pageSize=50'
        }).success(function(comments) {
           
            $scope.comments = comments;
            console.log(comments.length);

            currentPageComments++;

            if (j == 2 || comments.length < 50) {
                $scope.noMoreCommentsAvailable = true;
            }
            j++;
            
            $scope.$broadcast('scroll.infiniteScrollComplete');

        }).catch(function() {
            $scope.error = 'Can not get the comments';
        });  

    };

    // Fonction appelée lorsqu'on clique sur le bouton post comment dans les issueDetails
    $scope.postComments = function() {

        $http({
            method: 'POST',
            url: apiUrl + '/issues/'+issueId+'/comments',
            data: $scope.comment
        }).success(function(comments) {
            $ionicPopup.alert({
              title: 'Comment',
              template: 'Comment posted'
              });

        }).catch(function() {
            // If an error occurs, hide the loading message and show an error message.
            $scope.error = 'Can not post the comment';
        });  

    };

    // Fonction qui permet de changer l'état d'une issue
    $scope.manageIssues = function (){

        var issueState =  $scope.issue.state;

        if(issueState == "new" && $scope.action.type == "start"){

            $http({
            method: 'POST',
            url: apiUrl + '/issues/'+issueId+'/actions',
            data: $scope.action
            }).success(function(actions) {
                $ionicPopup.alert({
              title: 'State',
              template: 'State changed'
              });
 
            });
            
        }else if ((issueState == "new" || issueState == "inProgress") && $scope.action.type == "reject"){
            $http({
            method: 'POST',
            url: apiUrl + '/issues/'+issueId+'/actions',
            data: $scope.action
            }).success(function(actions) {
                $ionicPopup.alert({
              title: 'State',
              template: 'State changed'
              });
            });
        }else if (issueState == "inProgress" && $scope.action.type == "resolve"){

            $http({
            method: 'POST',
            url: apiUrl + '/issues/'+issueId+'/actions',
            data: $scope.action
            }).success(function(actions) {
                $ionicPopup.alert({
                  title: 'State',
                  template: 'State changed'
                });
            });


        }else{
            console.log('Vous ne respectez pas les conditions de transition des états');
        }
   
       
    };

    // Fonction permettant d'ajouter un issueType, seulement si l'user est staff
    $scope.addIssueType = function (){
        $http({
            method: 'POST',
            url: apiUrl + '/issueTypes/',
            data: $scope.issueType
            }).success(function(issueTypes) {
                $ionicPopup.alert({
                    title: 'Issue Type',
                    template: 'Issue Type added'
                });
            }).catch(function() {
                $scope.error = 'Can not post the new issue type';
                 
                });  

    };

    // Fonction qui permet de supprimer un issue type, seulement pour users staff
    $scope.deleteIssueType = function (){
        console.log($scope.data.selectedType);
        $http({
            method: 'DELETE',
            url: apiUrl + '/issueTypes/' + $scope.data.selectedType
            }).success(function(issueTypes) {
                $ionicPopup.alert({
                    title: 'Issue Type',
                    template: 'Issue Type deleted'
                });
            });

    };

    
});

// Create a new issue
angular.module('citizen-engagement').controller('newIssueCtrl', function(geolocation, $q, $log, $scope, $http, $state, apiUrl, qimgUrl, qimgSecret, $ionicPopup, CameraService) {

        // Fonction permettant de charger les types d'issues
          $scope.loadIssueTypes = function () {
                $scope.issue = {};
                    $http({
                        method: 'GET',
                        url: apiUrl + '/issueTypes/'
                    }).success(function (issueTypes) {
                    $scope.issueTypes = issueTypes;
                    geolocation.getLocation().then(function(data){
                        var coor = [data.coords.longitude, data.coords.latitude];

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

            // Fonction appelée lorsque on poste une nouvelle issue
            $scope.submit = function () {
                //console.log($scope.selected);
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

        // Fonction qui poste l'issue
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

// Taking picture with an IOS or Android device
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

  //Display all the issues on the map
 angular.module('citizen-engagement').controller("MapCtrl", function($scope, mapboxSecret, $http, apiUrl, geolocation) {
  var mapCtrl = this;
  var mapboxMapId = 'mapbox.satellite';
  var mapboxAccessToken = mapboxSecret;

  var mapboxTileLayerUrl = 'http://api.tiles.mapbox.com/v4/' + mapboxMapId;
  mapboxTileLayerUrl = mapboxTileLayerUrl + '/{z}/{x}/{y}.png';
  mapboxTileLayerUrl = mapboxTileLayerUrl + '?access_token=' + mapboxAccessToken;
        mapCtrl.center = {
              lat: 51.48,
              lng: 0,
              zoom: 15
        };
        mapCtrl.markers = [];
        geolocation.getLocation().then(function (data) {
          console.log("position  found");
            mapCtrl.center = {
                lat: data.coords.latitude,
                lng: data.coords.longitude,
                zoom: 15
            };
                mapCtrl.markers.push({
                    lat: data.coords.latitude,
                    lng: data.coords.longitude,
                    message: '<p>You are here! </p>',
                    getMessageScope: function() {
                        var scope = $scope.$new();
                        scope.issue = issue;
                        return scope;
                    }
                });
        }).catch(function(error) {
          console.log(error);
        });

        //console.log($scope.issues);
        $http({
            method: 'GET',
            url: apiUrl + '/issues?pageSize=50'
        }).success(function(issues) {
            angular.forEach(issues, function(issue) {
                mapCtrl.markers.push({
                    lat: issue.location.coordinates[1],
                    lng: issue.location.coordinates[0],
                    icon: {
                      iconUrl: 'img/location2.png',
                      iconSize: [40, 50]
                    },
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
