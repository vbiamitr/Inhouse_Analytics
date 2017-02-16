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
        $scope.fields = [
            {"key" : "country",         "name" : "Country",         "clicky" : "country",       "dbip" : "countryName",     "iplocation":"country"},
            {"key" : "region",          "name" : "State/Province",  "clicky" : "region",        "dbip" : "stateProv",       "iplocation":"region"},            
            {"key" : "city",            "name" : "City",            "clicky" : "city",          "dbip" : "city",            "iplocation":"city"},
            {"key" : "postalCode",      "name" : "Zip Code",        "clicky" : "postalCode",    "dbip" : "zipCode",         "iplocation":"postalCode"},
            {"key" : "latitude",        "name" : "Latitude",        "clicky" : "latitude",      "dbip" : "latitude",        "iplocation":"latitude"},
            {"key" : "longitude",       "name" : "Longitude",       "clicky" : "longitude",     "dbip" : "longitude",       "iplocation":"longitude"},
            {"key" : "isp",             "name" : "ISP",             "clicky" : "isp",           "dbip" : "isp",             "iplocation":"isp"},
            {"key" : "organization",    "name" : "Organization",    "clicky" : "organization",  "dbip" : "organization",    "iplocation":"organization"}
        ];       

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
            $scope.recordsInfo = []; // reset
            $scope.clicky_loading = true;
            var projection = ['geolocation', 'latitude', 'longitude', 'organization'];          
            var url = utilityService.makeUrl([utilityService.server_base_url, 'clicky', 'visitor-info', _id, projection.join(",")]);
            utilityService.makeHttpRequest(url, function(result){
                $scope.clicky_loading = false;    
                if(result.error){
                    $scope.errorMsg = result.statusText;
                }
                else {
                    if(typeof result["geolocation"] !== "undefined"){
                        var geoData = result['geolocation'].split(",");
                        if(geoData.length == 1){
                            result['country'] = geoData[0];                            
                            result['city'] = "";
                            result['region'] = "";
                        }
                        else if(geoData.length == 2){
                            result['city'] = geoData[0];
                            result['country'] = geoData[1].trim();
                            result['region'] = "";

                        }
                        else if(geoData.length == 3) {
                            result['city'] = geoData[0];                            
                            result['region'] = geoData[1].trim();
                            result['country'] = geoData[2].trim();
                        }
                    }

                    $scope.fields.forEach(function(field, index){
                        var info = {
                            "key" : field.key,
                            "name" : field.name
                        };
                        info["val"] = result[field.clicky] || '';
                        $scope.recordsInfo.push(info);
                    });
                }                
                resolve();
            });            
        };            

        $scope.searchUsingIplocation = function(resolve, reject){
            $scope.iplocation_info = []; // reset            
            $scope.iplocation_loading = true;
            var ip = $scope.search_ip.trim();
            var url = utilityService.makeUrl([utilityService.server_base_url, 'ipcheck',ip]);
            utilityService.makeHttpRequest(url, function(result){
                $scope.iplocation_loading = false;
                if(result.error){
                    $scope.errorMsg = result.statusText;
                }
                else {                    
                    $scope.fields.forEach(function(field, index){
                        var info = {
                            "key" : field.key,
                            "name" : field.name
                        };
                        info["val"] = result[field.iplocation] || '';
                        $scope.iplocation_info.push(info);
                    }); 
                }                               
                resolve();
            });
        };

        $scope.searchUsingDbIp = function(resolve, reject){
             $scope.dbip_info = []; // reset             
             $scope.dbip_loading = true;
            var ip = $scope.search_ip.trim();
            var url = utilityService.makeUrl([utilityService.server_base_url , 'ipcheck','dbip_api',ip]);
            utilityService.makeHttpRequest(url, function(result){                
                $scope.dbip_loading = false;
                if(result.error){
                    $scope.errorMsg = result.statusText;
                }
                else {
                    $scope.fields.forEach(function(field, index){
                        var info = {
                            "key" : field.key,
                            "name" : field.name
                        };
                        info["val"] = result[field.dbip] || '';
                        $scope.dbip_info.push(info);
                    });
                }                
                resolve();                
            });
        };

        function getParticipants(applicants){
            var participants = [];
            applicants.forEach(function(apl, i){
                if($scope[apl].length){
                    participants.push($scope[apl]);
                }
            });
            return participants;
        }

        function compareParticipants(participants){
            var weight = {};
            var len = participants.length;
            var p1,p2,pKey;
            var fields =  $scope.fields;
            if(len < 2){
                return weight;
            }
            // initialize weight
            fields.forEach(function(f,i){
                var key = f["key"];                
                weight[key] = 0;                
            });
            
            for(var i=0;i<len-1;i++){
                p1 = participants[i];
                for(var j=i+1;j<len;j++){
                    p2 = participants[j];                    
                    for(var k=0, flen = p1.length; k<flen; k++){                        
                        if(p1[k]["key"] == p2[k]["key"] && p1[k]["val"].toString().toLowerCase() == p2[k]["val"].toString().toLowerCase()){ 
                            pKey = p1[k]["key"];                           
                            weight[pKey] =  weight[pKey] + 1;
                        }
                    }
                }
            }
            return weight;
        }

        $scope.analyzeIp = function(){
            var applicants = ['recordsInfo', 'dbip_info', 'iplocation_info'];
            var participants = getParticipants(applicants);
            var weight = compareParticipants(participants);
            var colors= ['#FF0000', '#F39C12', '#28B463'];
            $scope.fields.forEach(function(field, i){
                var w = weight[field.key];
                if(w !== colors.length){
                    $(".list-group-item_" + i).css({
                        "color" : colors[w]
                    });
                }                
            });          
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