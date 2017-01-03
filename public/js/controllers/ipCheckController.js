angular.module('ipCheckControllerModule',[])
    .controller('ipCheckController', ['$scope', 'utilityService', function ($scope, utilityService) {
        $scope.iplocation_info = {};
        $scope.dbip_info = {};
        $scope.dbip_loading = false;
        $scope.iplocation_loading = false;
        $scope.dbip_fields = [];

        $scope.iplocation_fields = [];
            

        $scope.searchUsingIplocation = function(){
            $scope.iplocation_info = {}; // reset
            $scope.iplocation_fields = [];
            $scope.iplocation_loading = true;
            var ip = $scope.search_iplocation.trim();
            var url = utilityService.makeUrl(['ipcheck',ip]);
            utilityService.makeHttpRequest(url, function(result){
                $scope.iplocation_loading = false;
                $scope.iplocation_fields = [
                    {"key" : "country",  "name" : "Country"},
                    {"key" : "region",    "name" : "State/Province"},            
                    {"key" : "city",         "name" : "City"},
                    {"key" : "postalCode",      "name" : "Zip Code"},
                    {"key" : "latitude",     "name" : "Latitude"},
                    {"key" : "longitude",    "name" : "Longitude"},
                    {"key" : "isp",          "name" : "ISP"},
                    {"key" : "organization", "name" : "Organization"}
                ];
                $scope.iplocation_info = result;
            });
        };

        $scope.searchUsingDbIp = function(){
             $scope.dbip_info = {}; // reset
             $scope.dbip_fields = [];
             $scope.dbip_loading = true;
            var ip = $scope.search_dbip.trim();
            var url = utilityService.makeUrl(['ipcheck','dbip_api',ip]);
            utilityService.makeHttpRequest(url, function(result){                
                $scope.dbip_loading = false;
                $scope.dbip_fields = [
                    {"key" : "countryName",  "name" : "Country"},
                    {"key" : "stateProv",    "name" : "State/Province"},
                    {"key" : "district",     "name" : "district"},
                    {"key" : "city",         "name" : "City"},
                    {"key" : "zipCode",      "name" : "Zip Code"},
                    {"key" : "latitude",     "name" : "Latitude"},
                    {"key" : "longitude",    "name" : "Longitude"},
                    {"key" : "isp",          "name" : "ISP"},
                    {"key" : "organization", "name" : "Organization"}
                ];
                $scope.dbip_info = result;
                
            });
        };
    
    }]);