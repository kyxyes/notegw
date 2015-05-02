angular.module('MEANBlog',['ngRoute','ngMessages','ngResource','ngSanitize'])
        .config(function($routeProvider){
        $routeProvider
            .when('/',{
                templateUrl:'views/main_blogs.html',
                controller:'displayPostCtrl'
            })
            .when('/blogDetails/:id',{
                templateUrl:'views/blog_details.html',
                controller:'blogDetailsCtrl'
            })
            ;
    });


//$routeProvider 是针对ng-view的，不然没法根据route(when)切换页面（在这里是view）
//https://docs.angularjs.org/tutorial/step_07