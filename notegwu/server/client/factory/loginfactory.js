angular.module('NoteGW.service')
       .factory('NoteGWFactory', ['$resource', function($resource) {

           return $resource( 'http://localhost:8081/authentication',
                        { callback: "JSON_CALLBACK", format:'jsonp' }
                        
             );

    }])