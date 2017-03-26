angular.module('citizen-engagement').service('AuthService', function(store) {

  var service = {
    authToken: store.get('authToken'),

    setAuthToken: function(token) {
      service.authToken = token;
      store.set('authToken', token);
    },

    unsetAuthToken: function() {
      service.authToken = null;
      store.remove('authToken');
    }
  };

  return service;
});

angular.module('citizen-engagement').controller('LoginCtrl', function(apiUrl, AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state, $cookies) {
  var loginCtrl = this;
  // The $ionicView.beforeEnter event happens every time the screen is displayed.
  $scope.$on('$ionicView.beforeEnter', function() {
    // Re-initialize the user object every time the screen is displayed.
    // The first name and last name will be automatically filled from the form thanks to AngularJS's two-way binding.
    loginCtrl.user = {};
    // Pas toucher, permet de cacher les champs de registration de base.
    loginCtrl.registrationEnable = false;
    //console.log(loginCtrl.registrationEnable);
  });

  // Add the register function to the scope.
  loginCtrl.logIn = function() {

    // Forget the previous error (if any).
    delete loginCtrl.error;

    // Show a loading message if the request takes too long.
    $ionicLoading.show({
      template: 'Logging in...',
      delay: 750
    });

    $http({
      method: 'POST',
      url: apiUrl + '/auth',
      data: loginCtrl.user
    }).then(function(res) {

      var user = res.data.user;
      console.log(user);

      // On pousse des cookies afin de garder des données à exploiter dans les autres controllers
      $cookies.put('userRole',res.data.user.roles);
      $cookies.put('userName',res.data.user.name);

      // If successful, give the token to the authentication service.
      AuthService.setAuthToken(res.data.token);

      // Hide the loading message.
      $ionicLoading.hide();

      // Set the next view as the root of the history.
      // Otherwise, the next screen will have a "back" arrow pointing back to the login screen.
      $ionicHistory.nextViewOptions({
        disableBack: true,
        historyRoot: true
      });

      // Go to the issue creation tab.
      $state.go('app.home');

    }).catch(function(err) {

      // If an error occurs, hide the loading message and show an error message.
      $ionicLoading.hide();
      loginCtrl.error = 'Could not log in';
    });
  };

  // Add the register function to the scope.
  loginCtrl.register = function() {
    
    // Pas toucher ça, pour que le formulaire registration s'affiche
    loginCtrl.registrationEnable = true;

    // Forget the previous error (if any).
    delete loginCtrl.error;

    // Make the request to retrieve or create the user.
    console.log(loginCtrl.registrationEnable);
    if (loginCtrl.registrationEnable && loginCtrl.user.firstname != null && loginCtrl.user.lastname != null && loginCtrl.user.name != null && loginCtrl.user.password != null){
        loginCtrl.user.roles = "citizen";
        $http({
        method: 'POST',
        url: apiUrl + '/users',
        data: loginCtrl.user
      }).then(function(res) {
        loginCtrl.registrationEnable = false;
        // If successful, give the token to the authentication service.
        AuthService.setAuthToken(res.data.token);

        // Hide the loading message.
        $ionicLoading.hide();

        // Set the next view as the root of the history.
        // Otherwise, the next screen will have a "back" arrow pointing back to the login screen.
        $ionicHistory.nextViewOptions({
          disableBack: true,
          historyRoot: true
        });

        // Go to the login page.
        $state.go('login');

      }).catch(function() {

        // If an error occurs, hide the loading message and show an error message.
        $ionicLoading.hide();
        loginCtrl.error = 'Could not register.';
      });
    }else{
      console.log("Toutes les infos ne sont pas remplies");
    }
    
  };

    // Pour l'exploiter dans le menu
    $scope.user = {};
    $scope.user.name = $cookies.get('userName');
});


angular.module('citizen-engagement').controller('LogoutCtrl', function(AuthService, $state, $cookies) {
  var logoutCtrl = this;

  logoutCtrl.logOut = function() {
    AuthService.unsetAuthToken();
    $cookies.remove('userRole');
    $cookies.remove('userName');
    $state.go('login');
  };
});

angular.module('citizen-engagement').controller('AnyCtrl', function(AuthService, $http) {
  $http({
    url: '/api-proxy/issues',
    headers: {
      Authorization: 'Bearer ' + AuthService.authToken
    }
  }).then(function(res) {

  });
})

angular.module('citizen-engagement').factory('AuthInterceptor', function(AuthService) {
  return {

    // The request function will be called before all requests.
    // In it, you can modify the request configuration object.
    request: function(config) {

      // If the user is logged in, add the X-User-Id header.
      if (AuthService.authToken && !config.headers.Authorization) {
        config.headers.Authorization = 'Bearer ' + AuthService.authToken;
      }

      return config;
    }
  };
});
