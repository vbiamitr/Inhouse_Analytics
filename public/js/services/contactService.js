angular.module('contactServiceModule',[])
    .factory('contactService', ['$http', 'utilityService', function($http, utilityService){
        var service = {};

        // fields to show
        service.fields = ['firstName', 'lastName', 'fullName', 'company', 'email', 'companyDomain', 'title', 'titleTag', 'city', 'state', 'country', 'phoneNo', 'mobileNo', 'sourceEvent', 'source', 'leadOwner', 'status', 'lastTouchDate', 'emailVerified', 'phoneVerified', 'titleVerified',                               'companyVerified', 'notes'];

        service.fieldInfo = {
                    "firstName": {
                        "name": "First Name",
                        "info": "First Name of the person"
                    },
                    "lastName": {
                        "name": "Last Name",
                        "info": "Last Name of the person"
                    },
                    "fullName": {
                        "name": "Full Name",
                        "info": "Full Name of the person"
                    },
                    "company": {
                        "name": "Company",
                        "info": "Name of the company"
                    },
                    "email": {
                        "name": "Email Id",
                        "info": "Email Id"
                    },
                    "companyDomain": {
                        "name": "Company Domain",
                        "info": "Domain of the company"
                    },
                    "title": {
                        "name": "Title",
                        "info": "Title of the contact"
                    },
                    "titleTag": {
                        "name": "Title Tag",
                        "info": "Title Tag"
                    },
                    "city": {
                        "name": "City",
                        "info": "City"
                    },
                    "state": {
                        "name": "State",
                        "info": "State"
                    },
                    "country": {
                        "name": "Country",
                        "info": "Country"
                    },
                    "phoneNo": {
                        "name": "Phone No.",
                        "info": "Phone No."
                    },
                    "mobileNo": {
                        "name": "Mobile No.",
                        "info": "Mobile No."
                    },
                    "sourceEvent": {
                        "name": "Source Event",
                        "info": "Source Event"
                    },
                    "source": {
                        "name": "Source",
                        "info": "Source of the contact"
                    },
                    "leadOwner": {
                        "name": "Lead Owner",
                        "info": "Lead Owner"
                    },
                    "status": {
                        "name": "Status",
                        "info": "Status"
                    },
                    "lastTouchDate": {
                        "name": "Last Touch Date",
                        "info": "Last Touch Date"
                    },
                    "emailVerified": {
                        "name": "Email Verified",
                        "info": "Email Verified"
                    },
                    "phoneVerified": {
                        "name": "Phone Verified",
                        "info": "Phone Verified"
                    },
                    "titleVerified": {
                        "name": "Title Verified",
                        "info": "Title Verified"
                    },
                    "companyVerified": {
                        "name": "Company Verified",
                        "info": "Company Verified"
                    },
                    "notes": {
                        "name": "Notes",
                        "info": "Notes"
                    }
            };

        service.getContact = function(options, cb){        
            var urlParams = [utilityService.server_base_url ,'getcontact', options.skip, options.limit];
            if(typeof options.search != "undefined"){
                urlParams.push(options.search);            
            }             
            utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
        };

        service.getContactTotal = function(options, cb){
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