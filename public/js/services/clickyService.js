angular.module('clickyServiceModule',[])
    .factory('clickyService', ['$http', 'utilityService', function($http, utilityService){
        var service = {};

        service.projection = ['_id', 'ip_address', 'organization', 'geolocation', 'country_code', 'landing_page'];

        service.fields = [                             
                            { 'key' : 'ip_address',     'name' : 'IP Address'},
                            { 'key' : 'organization',   'name' : 'Organization'},
                            { 'key' : 'geolocation',    'name' : 'Geo Location'},
                            { 'key' : 'country_code',   'name' : 'Country'},
                            { "key" : "landing_page",    "name" : "Landing Page"}
                        ];  

       service.infoFields = [
           {"key" : "time_pretty",          "name" : "Date"},
           {"key" : "ip_address",           "name" : "IP Address"},
           {"key" : "organization",         "name" : "Organization"},
           {"key" : "landing_page",         "name" : "Landing Page"},
           {"key" : "time_total ",          "name" : "Total Time Spent"},
           {"key" : "total_visits",         "name" : "Total Visits"},
           {"key" : "web_browser",          "name" : "Web Browser"},
           {"key" : "operating_system",     "name" : "Operating System"},
           {"key" : "screen_resolution",    "name" : "Screen Resolution"},
           {"key" : "geolocation",          "name" : "Geolocation"},
           {"key" : "country_code",         "name" : "Country"},
           {"key" : "latitude",             "name" : "Latitude"},
           {"key" : "longitude",            "name" : "Longitude"}
           
       ];

       service.searchFields = [           
           {"key" : "ip_address",           "name" : "IP Address"},
           {"key" : "organization",         "name" : "Organization"},
           {"key" : "landing_page",         "name" : "Landing Page"},           
           {"key" : "geolocation",          "name" : "Geolocation"},
           {"key" : "country_code",         "name" : "Country"},
           {"key" : "actions",             "name" : "Actions"}         
       ];

       service.getVisitors = function(options, cb){        
            var urlParams = [utilityService.server_base_url ,'clicky/visitors-list', options.date, service.projection.join(','), options.skip, options.limit];
            if(typeof options.search != "undefined"){
                urlParams.push(options.search);            
            }             
            utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
        };

        service.getVisitorsTotal = function(options, cb){
            var urlParams = [utilityService.server_base_url ,'clicky/visitors-list-total', options.date];
            if(typeof options.search != "undefined"){
                urlParams.push(options.search);            
            }
            utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
        };

        service.getVisitorInfo = function(_id, cb){
            var urlParams = [utilityService.server_base_url ,'clicky/visitor-info', _id];
            utilityService.makeHttpRequest(utilityService.makeUrl(urlParams), cb);
        }

        return service;        
    }]);