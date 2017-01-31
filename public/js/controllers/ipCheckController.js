angular.module('ipCheckControllerModule',[])
    .controller('ipCheckController', ['$scope', 'utilityService', function ($scope, utilityService) {
        $scope.iplocation_info = {};
        $scope.dbip_info = {};
        $scope.dbip_loading = false;
        $scope.iplocation_loading = false;
        $scope.dbip_fields = [];

        $scope.iplocation_fields = [];
            

        $scope.searchUsingIplocation = function(resolve, reject){
            $scope.iplocation_info = {}; // reset
            $scope.iplocation_fields = [];
            $scope.iplocation_loading = true;
            var ip = $scope.search_ip.trim();
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
                resolve();
            });
        };

        $scope.searchUsingDbIp = function(resolve, reject){
             $scope.dbip_info = {}; // reset
             $scope.dbip_fields = [];
             $scope.dbip_loading = true;
            var ip = $scope.search_ip.trim();
            var url = utilityService.makeUrl(['ipcheck','dbip_api',ip]);
            utilityService.makeHttpRequest(url, function(result){                
                $scope.dbip_loading = false;
                $scope.dbip_fields = [
                    {"key" : "countryName",  "name" : "Country"},
                    {"key" : "stateProv",    "name" : "State/Province"},
                    /*{"key" : "district",     "name" : "district"},*/
                    {"key" : "city",         "name" : "City"},
                    {"key" : "zipCode",      "name" : "Zip Code"},
                    {"key" : "latitude",     "name" : "Latitude"},
                    {"key" : "longitude",    "name" : "Longitude"},
                    {"key" : "isp",          "name" : "ISP"},
                    {"key" : "organization", "name" : "Organization"}
                ];
                $scope.dbip_info = result;
                resolve();
                
            });
        };

        $scope.analyzeIp = function(){
            if(Object.keys($scope.dbip_info).length && Object.keys($scope.iplocation_info).length){
                if($scope.dbip_info.hasOwnProperty("error") || $scope.iplocation_info.hasOwnProperty("error")){
                    return;
                }

                $scope.analyzedIp = {};
                $scope.dbip_fields.forEach(function(field, i){
                    if(field.name == $scope.iplocation_fields[i].name){
                        if($scope.dbip_info[field.key] == $scope.iplocation_info[$scope.iplocation_fields[i].key]){
                            $scope.analyzedIp[field.name] = "equal";
                        }
                        else
                        {
                            $scope.analyzedIp[field.name] = "diff";
                        }

                        $(".list-group-item_" + i).addClass($scope.analyzedIp[field.name]);
                    }
                });

                
            }            
        };

        $scope.searchIpInfo = function(){          
            var promiseArr = [];
            promiseArr.push(
                new Promise(function(resolve, reject){
                    $scope.searchUsingIplocation(resolve, reject);
                })
            );

            promiseArr.push(
                new Promise(function(resolve, reject){
                    $scope.searchUsingDbIp(resolve, reject);
                })
            );

            Promise.all(promiseArr).then(function(){
                $scope.analyzeIp();
            });            
        }
    
    }]);