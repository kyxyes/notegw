angular.module('NoteGW')
       .controller('allnotesCtrl',function($scope,$http){
        $http.get('/allnotes').success(function(data){
            $scope.notes = data;
        });
    });