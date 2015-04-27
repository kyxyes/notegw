var myApp = angular.module('NoteGW')
   .controller('LoginCtrl',function($scope, $http, $q, NoteGWFactory){

       //$http.post('/getuser').success(function(data){
       //    $rootScope.currentUser=data.username;
       //});


   });




      myApp.factory('NoteGWFactory', ['$resource', function($resource) {
         var service = {};
         service.getGWLogin = function($http, $q){
           // return $resource( 'http://localhost:8081/authentication',
           //              { callback: "JSON_CALLBACK", format:'jsonp' }

           //   );
           var deferred = $q.defer();
           $http({
           url:'http://localhost:8081/authentication',
           method:"GET",
           crossDomain: true,
           dataType: 'jsonp'
         }).success(function(data){
          deferred.resolve(data);
         });
           return deferred.promise;
         }
        return service;

    }])