angular.module('citizen-engagement')

.controller("allIssuesCtrl", function($scope, $http, apiUrl) {

    $scope.noMoreItemsAvailable = false;
    $scope.issues = [];
    var i = 0;
    var currentPage = 0

    $scope.loadMore = function() {

        i++;
        $http({
            method: 'GET',
            url: apiUrl + '/issues',
            headers: {
                'x-pagination': currentPage + ";1"
            }
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
        $http({
            method: 'GET',
            url: apiUrl + '/issues/'+issueId
        }).success(function(issue) {

            $scope.issue = issue;
        });


})
    .controller("newIssueCtrl", function($scope, $http, apiUrl, $stateParams, GeolocService){
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
        });