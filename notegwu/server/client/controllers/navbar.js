angular.module('NoteGW')
    .controller('NavbarCtrl', function($scope, $rootScope, $http, $location) {
      //$scope.isAuthenticated = function() {
      //  return $auth.isAuthenticated();
      //};
      //
      //$scope.logout = function() {
      //  $auth.logout();
      //  delete $window.localStorage.currentUser;
      //};

      $scope.logout = function(){
        console.log('this is logout');
        $http.get('http://localhost:8081/logout').success(function(){
          $rootScope.currentUser = null;
          delete $rootScope;
          $location.path('/login');
        });

      }
    });
