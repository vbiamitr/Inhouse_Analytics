angular.module('ipCheckControllerModule',[])
    .controller('ipCheckController', ['$scope', 'utilityService', 'companyService', function ($scope, utilityService, companyService) {
        var collectionName = "clicky",
            collectionObj = {
                collection : collectionName
            },
            customService = companyService.initMethods(collectionObj);
        $scope.iplocation_info = {};
        $scope.dbip_info = {};
        $scope.dbip_loading = false;
        $scope.iplocation_loading = false;
        $scope.dbip_fields = [];
        $scope.date = moment('2016-09-20').subtract(1,'day').format('YYYY-MM-DD'); 
        $scope.iplocation_fields = [];
        $scope.recordsInfo = {};        
        $scope.colsw = 100;
        $scope.fields = [];  
        $scope.fieldInfo = {};

        function updatePages(){
            var totalPages = Math.floor($scope.cursor_total / $scope.cursor_limit) + 1;            
            var diff = 3;
            var page = $scope.page;
            var pageMin = page - diff;
            var tempCalc = 0;
            $scope.totalPages = totalPages;
            $scope.pages.length = 0;
            if(pageMin < 1){
                pageMin = 1;                
            }
            pageMax = pageMin + diff * 2;
            if(pageMax > totalPages){
                pageMin = pageMin - (pageMax - totalPages);
                pageMax = totalPages;
                if(pageMin < 1){
                    pageMin = 1;                
                }
            } 
            for(var i=pageMin;i<=pageMax;i++){
                $scope.pages.push(i);
            }
            
            if($scope.records.length){
                $scope.recordStart = (page - 1) * $scope.cursor_limit + 1;
                $scope.recordEnd = $scope.recordStart + $scope.records.length - 1;
            }                                          
        }

        function getRecordsCallback(result){
            if(result.error){
                $scope.error =  result.statusText;
            }
            else {         
                $scope.cursor_skip = $scope.cursor_skip + result.length; 
                $scope.records.length = 0;
                $scope.records = $scope.records.concat(result);  
                updatePages();     
            }
        }

        function getRecordTotalCallback(result){
            if(result.error){
                $scope.error =  result.statusText;
            }
            else {           
                $scope.cursor_total = result.cursor_total;  
                updatePages();
            }
        }

        function getRecordInfoCallBack(result){
            if(result.error){
                $scope.error =  result.statusText;
            }
            else {                    
                $scope.recordsInfo = result;  
                //console.log($scope.recordsInfo);     
            }
        }

        function updateRecordInfoCallback(result){
            if(result.error){
                $scope.error =  result.statusText;
            }
            else{
                if(Object.keys(elementIdToUpdate).length){
                     $( '#' + $scope.recordsInfo._id + '_' + elementIdToUpdate.id ).text(elementIdToUpdate.val);     // tried to wrap it in angular element, but doesn't work                  
                    elementIdToUpdate={};
                }
                //console.log("Saved");
            }
        }

        $scope.initSearch = function(page){
            var options;
            if(page){
                if(page < 1 || page > $scope.totalPages){
                    return;
                }
                $scope.page = page;
            }
            else
            {
                $scope.cursor_skip = 0;
                $scope.cursor_limit = 200;            
                $scope.cursor_total = 0;
                $scope.records = [];            
                $scope.pages = [];  
                $scope.page = 1;
                $scope.recordStart = 0;
                $scope.recordEnd = 0;
            }                
            
            options = {
                date : $scope.date,
                projection : ['ip_address', 'organization'],
                skip : ($scope.page - 1) * $scope.cursor_limit,
                limit : $scope.cursor_limit
            };

            if($scope.search){
                options.search = $scope.search;
            }
            customService.getRecord(options, getRecordsCallback);
            if(!page){
                customService.getRecordTotal(options, getRecordTotalCallback);
            }                              
        };

        $scope.getInfo = function (_id, resolve, reject){
            $scope.recordsInfo = {};
            $scope.clicky_fields = [];
            $scope.clicky_loading = true;
            var projection = ['geolocation', 'latitude', 'longitude', 'organization'];          
            var url = utilityService.makeUrl([utilityService.server_base_url, 'clicky', 'visitor-info', _id, projection.join(",")]);
            utilityService.makeHttpRequest(url, function(result){
                $scope.clicky_loading = false;
                $scope.clicky_fields = [
                    {"key" : "country",  "name" : "Country"},
                    {"key" : "region",    "name" : "State/Province"},            
                    {"key" : "city",         "name" : "City"},
                    {"key" : "postalCode",      "name" : "Zip Code"},
                    {"key" : "latitude",     "name" : "Latitude"},
                    {"key" : "longitude",    "name" : "Longitude"},
                    {"key" : "isp",          "name" : "ISP"},
                    {"key" : "organization", "name" : "Organization"}
                ];
                
                if(typeof result["geolocation"] !== "undefined"){
                    var geoData = result['geolocation'].split(",");
                    if(geoData.length){
                        result['city'] = geoData[0];
                        result['region'] = geoData[1] || "";
                       if(typeof geoData[2] === "undefined"){
                           result['country'] = result['region'];
                           result['region'] = "";
                       }
                       else
                       {
                           result['country'] = geoData[2];
                       }
                    }
                }
                $scope.recordsInfo = result;
                resolve();
            });            
        };            

        $scope.searchUsingIplocation = function(resolve, reject){
            $scope.iplocation_info = {}; // reset
            $scope.iplocation_fields = [];
            $scope.iplocation_loading = true;
            var ip = $scope.search_ip.trim();
            var url = utilityService.makeUrl([utilityService.server_base_url, 'ipcheck',ip]);
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
            var url = utilityService.makeUrl([utilityService.server_base_url , 'ipcheck','dbip_api',ip]);
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

        $scope.searchIpInfo = function(_id, ip){          
            var promiseArr = [];
            if(ip){
                $scope.search_ip = ip;
            }

            if(_id){
                promiseArr.push(
                    new Promise(function(resolve, reject){
                        $scope.getInfo(_id, resolve, reject);
                    })
                );
            }
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
        };

        $scope.initSearch();
    
    }]);