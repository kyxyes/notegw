angular.module('NoteGW')
 .controller('mynoteDetailCtrl', function($scope, $http, $location){
 	 var guid = $location.path().split('/').pop();
      $http.get('http://localhost:8081/getmynotedetail/'+guid).success(function(data){
      	//$scope.note = data;
          $scope.notehtmlstring = data.content;
          $scope.createDate= data.created;
          $scope.updateDate= data.updated;
      });

      $http.get('http://localhost:8081/gettags/'+guid).success(function(data){
          $scope.tags = data;
      });

      $scope.sync = function(){  //sync this note
          console.log("this is the guid "+guid);
          $http.post('http://localhost:8081/sync/'+guid);
      }
 });