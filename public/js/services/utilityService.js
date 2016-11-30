angular.module('utilityServiceModule',[])
    .factory('utilityService', ['$http', function($http){
        var server_base_url = "http://localhost:3000";
        var service = {
            server_base_url : server_base_url,

            makeUrl : function(url_arr){
                return url_arr.join('/');
            },
            
            makeHttpRequest: function(url, cb){
                $http({
                    method: "GET",
                    url: url
                }).then(function apiSuccess(response){        
                cb(response.data);                
                }, function apiError(response){
                    cb(response);        
                });
            }
        };
        return service;
    }]);
