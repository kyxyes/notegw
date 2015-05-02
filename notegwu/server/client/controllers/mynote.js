angular.module('NoteGW')
 .controller('mynoteCtrl', function($scope, $rootScope, $http, $location){
      //var getMyNote = function(){
        $http.get('/getuser').success(function(data){
            $rootScope.currentUser= data.username;
        });

      	 $http.get('/getmynotes')
      	.success(function(data){
         $scope.notes = data;
      	});


      //}
 });