angular.module('NoteGW',['ngRoute','ngMessages','ngResource','ngSanitize'])
   .config(function($routeProvider){
   	$routeProvider
   	.when('/login', {
      templateUrl: './views/login.html',    //if no './' e.g. 'views/login' then search whole files
      controller: 'LoginCtrl'
   	})//jump to login page
   	.when('/mynote', {
      templateUrl: './views/mynote.html',
      controller: 'mynoteCtrl'
   	})
      .when('/mynotedetail/:id', {
      templateUrl: './views/mynotedetail.html',
      controller: 'mynoteDetailCtrl'
      }) //this is detail for a evernote file
   	.when('/allnotesdetail/:id', {
       templateUrl:'views/sharednotesdetail.html',
       controller:'sharedNotesDetailCtrl'
   	})//browse details of public  notes
   	.when('/allnotes', {
      templateUrl: './views/allnotes.html',
      controller: 'allnotesCtrl'
   	}) //this is a public sharing page

   	 .otherwise('/');
   });
  

   //登录进入自己的主页，可以再选择进入分享大厅