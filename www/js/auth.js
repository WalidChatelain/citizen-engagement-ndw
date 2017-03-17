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

angular.module('citizen-engagement').controller('LoginCtrl', function(apiUrl, AuthService, $http, $ionicHistory, $ionicLoading, $scope, $state) {
  var loginCtrl = this;

  // The $ionicView.beforeEnter event happens every time the screen is displayed.
  $scope.$on('$ionicView.beforeEnter', function() {
    //console.log('test');
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

    // Make the request to retrieve or create the user.
    // TU DOIS UTILISER LA VARIABLE loginCtrl.registrationEnable pour tester si tu dois accepter la registration
    // si false = envoie pas, si true et que les champs sont correct = envoie
    $http({
      method: 'POST',
      url: apiUrl + '/auth',
      data: loginCtrl.user
    }).then(function(res) {

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
    /*loginCtrl.user.firstname = "coucou";
    loginCtrl.user.lastname = "test";
    loginCtrl.user.phone = "123123123";*/
    loginCtrl.user.roles = "citizen";

    // Pas toucher ça, pour que le formulaire registration s'affiche
    loginCtrl.registrationEnable = true;
    //console.log(loginCtrl.registrationEnable);


    // Forget the previous error (if any).
    delete loginCtrl.error;

    // Show a loading message if the request takes too long.
    /*$ionicLoading.show({
      template: 'Register in...',
      delay: 750
    });*/

    // Make the request to retrieve or create the user.
    console.log(loginCtrl.registrationEnable);
    if (loginCtrl.registrationEnable && loginCtrl.user.firstname != null && loginCtrl.user.lastname != null && loginCtrl.user.name != null && loginCtrl.user.password != null){
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
      console.log("ça passe pas");
    }
    
  };
});

angular.module('citizen-engagement').controller('LogoutCtrl', function(AuthService, $state) {
  var logoutCtrl = this;

  logoutCtrl.logOut = function() {
    AuthService.unsetAuthToken();
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
    // ...
  });
})

angular.module('citizen-engagement').factory('AuthInterceptor', function(AuthService) {
  return {

    // The request function will be called before all requests.
    // In it, you can modify the request configuration object.
    request: function(config) {

      // If the user is logged in, add the X-User-Id header.
      if (AuthService.authToken) {
        config.headers.Authorization = 'Bearer ' + AuthService.authToken;
      }

      return config;
    }
  };
});
