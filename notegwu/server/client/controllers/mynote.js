angular.module('NoteGW')
 .controller('mynoteCtrl', function($scope, $rootScope, $http, $location){
      //var getMyNote = function(){
        $http.get('http://localhost:8081/getuser').success(function(data){
            $rootScope.currentUser= data.username;
        });

      	 $http.get('http://localhost:8081/getmynotes')
      	.success(function(data){
         $scope.notes = data;
      	});


      //}
 });