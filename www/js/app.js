// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('citizen-engagement', ['ionic', 'angular-storage','geolocation'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
})
angular.module('citizen-engagement').config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

      // This is the state of the login
    .state('login', {
      url: '/login',
      controller: 'LoginCtrl',
      controllerAs: 'loginCtrl',
      templateUrl: 'templates/login.html'
    })

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/menu.html'
    })

    .state('app.home', {
      url: '/home',
      views: {
        'menuContent': {
          templateUrl: 'templates/home.html',
        }
      }
    })

    .state('app.myProfile', {
      url: '/myProfile',
      views: {
        'menuContent': {
          templateUrl: 'templates/myProfile.html'
        }
      }
    })

    .state('app.issueList', {
      url: '/issueList',
      views: {
        'menuContent': {
          templateUrl: 'templates/issueList.html'
        }
      }
    })

    .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html'
        }
      }
    })

    .state('app.policy', {
      url: '/policy',
      views: {
        'menuContent': {
          templateUrl: 'templates/policy.html'
        }
      }
    })

    .state('app.newIssue', {
      url: '/newIssue',
      views: {
        'menuContent': {
          templateUrl: 'templates/newIssue.html'
        }
      }
    })


    .state('app.issueDetails', {
      url: '/issueDetails/:issueId',
      views: {
        'menuContent': {
          templateUrl: 'templates/issueDetails.html',
          controller: "issueCtrl",
          controllerAs: "issueCtrl"
        }
        
      }

    })

    .state('app.issueMap', {
      url: '/issueMap',
      views: {
        'tab-issueMap': {
          templateUrl: 'templates/issueMap.html',
          controller: 'AllIssuesMapController'
        }
      }
    })

  ;

  // Define the default state (i.e. the first screen displayed when the app opens).
  $urlRouterProvider.otherwise(function($injector) {
    $injector.get('$state').go('app.home'); // Go to the home page by default.
  });
});

angular.module('citizen-engagement').config(function($httpProvider) {
  $httpProvider.interceptors.push('AuthInterceptor');
});

//Redirige les utilisateurs vers la page de login si ils ne sont pas log.
angular.module('citizen-engagement').run(function(AuthService, $rootScope, $state) {

  // Listen for the $stateChangeStart event of AngularUI Router.
  // This event indicates that we are transitioning to a new state.
  // We have the possibility to cancel the transition in the callback function.
  $rootScope.$on('$stateChangeStart', function(event, toState) {

    // If the user is not logged in and is trying to access another state than "login"...
    if (!AuthService.authToken && toState.name != 'login') {

      // ... then cancel the transition and go to the "login" state instead.
      event.preventDefault();
      $state.go('login');
    }
  });
});
