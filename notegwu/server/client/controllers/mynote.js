angular.module('NoteGW')
 .controller('mynoteCtrl', function($scope, $http){
      //var getMyNote = function(){
      	 $http.get('http://localhost:8081/getmynotes')
      	.success(function(data){
         $scope.notes = data;
      	});



      //}
 });