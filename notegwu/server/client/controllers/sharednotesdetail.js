angular.module('NoteGW')
  .controller('sharedNotesDetailCtrl',function($scope, $http, $location){
        var guid = $location.path().split('/').pop();
        $http.get('/getSharedNotesDetail/'+guid)
            .success(function(data){
                $scope.tags = data[0].tags;
                $scope.createDate = data[0].createDate;
                $scope.updateDate = data[0].updateDate;
                $scope.content = data[0].content;
            });
    }
    );