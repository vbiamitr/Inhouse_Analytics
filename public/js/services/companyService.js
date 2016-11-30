angular.module('companyServiceModule',[])
    .factory('companyService', ['$http', 'utilityService', function($http, utilityService){
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
            var urlParams = [utilityService.server_base_url ,'getcompany', options.skip, options.limit];
            if(typeof options.search != "undefined"){
                urlParams.push(options.search);            
            }             
            utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
        };

        service.getCompanyTotal = function(options, cb){
            var urlParams = [utilityService.server_base_url ,'getcompany_total'];
            if(typeof options.search != "undefined"){
                urlParams.push(options.search);            
            }
            utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
        };

        return service;        
    }]);