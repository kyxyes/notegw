angular.module('NoteGW')
       .controller('allnotesCtrl',function($scope,$http){
        $http.get('http://localhost:8081/allnotes').success(function(data){
            $scope.notes = data;
        });
    });