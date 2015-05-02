angular.module('MEANBlog')
    .controller('displayPostCtrl',function($scope, $http){
       console.log("hi, this is displayPostCtrl")
        $http.get('/displayMainPagePosts').success(function(data){
            $scope.myposts= data;
        });
    });