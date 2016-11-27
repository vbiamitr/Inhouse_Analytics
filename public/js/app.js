var ih_app = angular.module('ih_app', ['ngRoute','ngFileUpload']);

ih_app.directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            element.bind('scroll', function () {               
                if (raw.scrollTop + raw.offsetHeight + 5 > raw.scrollHeight) {                    
                    scope.$apply(attrs.scrolly);
                }
            });
        }
    };
});

ih_app.factory('configService', ['$http', function($http){
    var server_base_url = "http://localhost:3000";
    return {
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
}]);

ih_app.config(function($routeProvider) {
    $routeProvider
    .when("/upload/:type", {
        templateUrl : "/public/views/uploads.html",
        controller: "uploadController"
    })
    .when("/view_company", {
        templateUrl : "/public/views/view_company.html",
        controller: "viewController"
    })
    .otherwise("/");
});

ih_app.controller('uploadController', ['$scope', 'Upload', '$timeout', '$routeParams', 'configService', function ($scope, Upload, $timeout, $routeParams, configService) {
    
    var url = configService.server_base_url + '/uploads/xlsx';
    $scope.type = $routeParams.type;
    $scope.uploadFiles = function (files) {
        $scope.files = files;
        if (files && files.length) {
            Upload.upload({
                url: url,
                data: {
                    files: files
                }
            }).then(function (response) {
                $timeout(function () {
                    $scope.result = response.data;
                });
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + JSON.stringify(response.data);
                }
            }, function (evt) {
                $scope.progress = 
                    Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    };
}]);

ih_app.controller('viewController', ['$scope', 'configService', function ($scope, configService) {
    $scope.cursor_skip = 0;
    $scope.cursor_limit = 200;
    $scope.stopScrolling = !1;
    $scope.cursor_total = 0;
    var url = configService.makeUrl([configService.server_base_url ,'getcompany', $scope.cursor_skip, $scope.cursor_limit]);
    $scope.companies = [];
    configService.makeHttpRequest(url, function(result){
        if(result.error){
            $scope.error =  result.statusText;
        }
        else {         
            $scope.cursor_skip = result.length;
            $scope.companies = $scope.companies.concat(result);       
        }
    });

    var totalUrl = configService.makeUrl([configService.server_base_url ,'getcompany_total']);
    configService.makeHttpRequest(totalUrl, function(result){
        if(result.error){
            $scope.error =  result.statusText;
        }
        else {           
            $scope.cursor_total = result.cursor_total;       
        }
    });

    $scope.showMore = function(){
        if(!$scope.stopScrolling){
            url = configService.makeUrl([configService.server_base_url ,'getcompany', $scope.cursor_skip, $scope.cursor_limit]);
            configService.makeHttpRequest(url, function(result){
                if(result.error){
                    $scope.error =  result.statusText;
                }
                else {         
                    $scope.cursor_skip = $scope.cursor_skip + result.length;
                    if(result.length == 0){
                        $scope.stopScrolling = !0;
                    }
                    $scope.companies = $scope.companies.concat(result);      
                }
            });
        }
        
    };
    

}]);