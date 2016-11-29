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

ih_app.factory('companyService',['$http', 'configService', function($http, configService){
    var service = {};

    service.fields = [{"key":"company","name":"Company"},{"key":"domain","name":"Domain"},{"key":"address","name":"Address"},{"key":"city","name":"City"},{"key":"state","name":"State"},{"key":"zipcode","name":"Zipcode"},{"key":"country","name":"Country"},{"key":"industry","name":"Industry"},{"key":"sic_code","name":"SIC Code"},{"key":"revenue","name":"Revenue"},{"key":"employees","name":"Employees"},{"key":"software","name":"Software"},{"key":"parent","name":"Parent"}];  

    service.fieldInfo = {
        'company' : 'Name of the company',
        'domain' : 'Domain name of the company',
        'address' : 'Street Address of the company',
        'city' : 'Name of the city',
        'state' : 'Name of the state/province',
        'zipcode' : 'Zip Code or Postal Code',
        'country' : 'Name of the country',
        'industry' : 'Type of industry',
        'sic_code' : 'SIC (Standard Industrial Classification) code of the industry',
        'revenue' : 'Revenue of the company',
        'employees' : 'No. of employees in the company',
        'software' : 'Softwares being used by the company.Eg. "BO,BI,BOBJ" ',
        'parent' : 'The parent company'
    };

    service.getCompany = function(options, cb){        
        var urlParams = [configService.server_base_url ,'getcompany', options.skip, options.limit];
        if(typeof options.search != "undefined"){
            urlParams.push(options.search);            
        }             
        configService.makeHttpRequest(configService.makeUrl(urlParams), cb);
    };

    service.getCompanyTotal = function(options, cb){
        var urlParams = [configService.server_base_url ,'getcompany_total'];
        if(typeof options.search != "undefined"){
            urlParams.push(options.search);            
        }
        configService.makeHttpRequest(configService.makeUrl(urlParams), cb);
    };
    return service;
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

ih_app.controller('uploadController', ['$scope', 'Upload', '$timeout', '$routeParams', 'configService', 'companyService',  function ($scope, Upload, $timeout, $routeParams, configService, companyService) {
    $scope.fields = companyService.fields;
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
    $scope.getFieldInfo = function(field){
        if(field && companyService.fieldInfo){
            $scope.fieldInfo = companyService.fieldInfo[field] || '';
            $scope.selectedField = field;
        }
    }
}]);

ih_app.controller('viewController', ['$scope', 'companyService', function ($scope, companyService) {
    $scope.cursor_skip = 0;
    $scope.cursor_limit = 200;
    $scope.stopScrolling = !1;
    $scope.cursor_total = 0;
    $scope.companies = [];
    $scope.companyInfo = {};
    $scope.showInfo = false;
    $scope.selectedCompany = "";
    $scope.fields = companyService.fields;
    var options = {
        skip : $scope.cursor_skip,
        limit : $scope.cursor_limit
    };
    if($scope.search){
        options.search = $scope.search;
    }
    companyService.getCompany(options, function getCompanyCallback(result){
        if(result.error){
            $scope.error =  result.statusText;
        }
        else {         
            $scope.cursor_skip = result.length;
            $scope.companies = $scope.companies.concat(result);       
        }
    });  

    companyService.getCompanyTotal(options, function getCompanyTotalCallback(result){
        if(result.error){
            $scope.error =  result.statusText;
        }
        else {           
            $scope.cursor_total = result.cursor_total;       
        }
    });     

    $scope.showMore = function(){
        var options = {
            skip : $scope.cursor_skip,
            limit : $scope.cursor_limit
        };

        if($scope.search){
            options.search = $scope.search;
        }

        if(!$scope.stopScrolling){
            companyService['getCompany'](options , function showMoreCallback(result){
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

    $scope.initSearch = function(){                
        $scope.cursor_skip = 0;
        $scope.cursor_limit = 200;
        $scope.stopScrolling = !1;
        $scope.cursor_total = 0;
        $scope.companies = [];
        $scope.showInfo = false;
        $scope.selectedCompany = "";
        var options = {
            skip : $scope.cursor_skip,
            limit : $scope.cursor_limit
        };

        if($scope.search){
            options.search = $scope.search;
        }

        companyService['getCompany'](options, function getCompanyCallback(result){
            if(result.error){
                $scope.error =  result.statusText;
            }
            else {         
                $scope.cursor_skip = result.length;
                $scope.companies = $scope.companies.concat(result);       
            }
        });

        companyService['getCompanyTotal'](options, function getCompanyTotalCallback(result){
            if(result.error){
                $scope.error =  result.statusText;
            }
            else {           
                $scope.cursor_total = result.cursor_total;       
            }
        });              
    }

    $scope.getInfo = function (company){
        $scope.showInfo = true;
        $scope.companyInfo = company;
        $scope.selectedCompany = company.domain;
    }

    $scope.advancedSearch = function(){
        var fields = $scope.fields;
        var search_obj = {};
        fields.forEach(function(field){
            var val = $scope['input_' + field.key];
            if(val){
                search_obj[field.key] = val;
            }
        });
        $scope.search = JSON.stringify(search_obj);
        $scope.initSearch();
    }
}]);