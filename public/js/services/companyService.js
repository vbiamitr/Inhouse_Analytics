angular.module('companyServiceModule',[])
    .factory('companyService', ['$http', 'utilityService', function($http, utilityService){
        var service = {};

        // fields to show
        service.fields = ["company", "domain", "address", "city", "state", "country", "industry", "revenue", "employees", "software", "status"];

        service.fieldInfo = {
                    "company": {
                        "name": "Company",
                        "info": "Name of the company"
                    },
                    "domain": {
                        "name": "Domain",
                        "info": "Domain name of the company"
                    },
                    "address": {
                        "name": "Address",
                        "info": "Street Address of the company"
                    },
                    "city": {
                        "name": "City",
                        "info": "Name of the city"
                    },
                    "state": {
                        "name": "State",
                        "info": "Name of the state/province"
                    },
                    "zipcode": {
                        "name": "Zipcode",
                        "info": "Zip Code or Postal Code"
                    },
                    "country": {
                        "name": "Country",
                        "info": "Name of the country"
                    },
                    "industry": {
                        "name": "Industry",
                        "info": "Type of industry"
                    },
                    "sic_code": {
                        "name": "SIC Code",
                        "info": "SIC (Standard Industrial Classification) code of the industry"
                    },
                    "revenue": {
                        "name": "Revenue",
                        "info": "Revenue of the company"
                    },
                    "employees": {
                        "name": "Employees",
                        "info": "No. of employees in the company"
                    },
                    "software": {
                        "name": "Software",
                        "info": "Softwares being used by the company.Eg. \"BO,BI,BOBJ\" "
                    },
                    "parent": {
                        "name": "Parent",
                        "info": "The parent company"
                    },
                    "status": {
                        "name": "Status",
                        "info": "Client's Status"
                    },
                    "account_mgr": {
                        "name": "Account Manager",
                        "info": "Name of manager dealing with the client"
                    },
                    "ip_address": {
                        "name": "IP Address",
                        "info": "IP Address of the company"
                    },
                    "comment": {
                        "name": "Comment",
                        "info": "Comments"
                    }
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

        service.getCompanyInfo = function(_id, cb){
            var urlParams = [utilityService.server_base_url ,'getcompany-info', _id];
            utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
        }

        service.updateCompanyInfo = function(_id, field,val, cb){
            var urlParams = [utilityService.server_base_url ,'updatecompany-info', _id, field, val];
            utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
        }

        service.updateCompanyComment = function(_id, jsdate, val, cb){
            var urlParams = [utilityService.server_base_url ,'updatecompany-comment', _id, jsdate, val];
            utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
        }

        service.updateCompanyCommentDelete = function(_id, jsdate, cb){
            var urlParams = [utilityService.server_base_url ,'updatecompany-comment-delete', _id, jsdate];
            utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
        }



        return service;        
    }]);