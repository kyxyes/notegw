angular.module('NoteGW')
 .controller('mynoteDetailCtrl', function($scope, $http, $location){
 	 var guid = $location.path().split('/').pop();
      $http.get('http://localhost:8081/getmynotedetail/'+guid).success(function(data){
      	//$scope.note = data;
          $scope.notehtmlstring = data.content;
          $scope.createDate= data.created;
          $scope.updateDate= data.updated;
      });
        var isSync;
        $http.get('http://localhost:8081/isSync/'+guid).success(function(data){
            isSync = data;  //if stored in $scope.isSync:Uncaught TypeError: Cannot read property '0' of null
        });

      $http.get('http://localhost:8081/gettags/'+guid).success(function(data){
          $scope.tags = data;
      });

      $scope.sync = function(){  //sync this note
          console.log("this is the sync ");
          isSync = true;
          $http.post('http://localhost:8081/sync/'+guid);
      }

      $scope.dissync = function(){
          console.log("this is the dissync");
          isSync = false;
          $http.post('http://localhost:8081/dissync/'+guid);
      }

      $scope.isSync = function(){
          //console.log("this is isSync"+ $scope.isSync);
          return isSync;
      }
 });