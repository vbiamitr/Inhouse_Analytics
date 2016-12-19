angular.module('clickyControllerModule',[])
    .controller('clickyController', ['$scope', 'clickyService', function ($scope, clickyService) {

        $scope.date = moment('2016-09-20').subtract(1,'day').format('YYYY-MM-DD'); 
        $scope.colsw = 100;
        $scope.fields = clickyService.fields; 
        $scope.infoFields = clickyService.infoFields;
        $scope.searchFields = clickyService.searchFields;

        function resetScopeVar(){
            $scope.cursor_skip = 0;
            $scope.cursor_limit = 200;
            $scope.stopScrolling = !1;
            $scope.cursor_total = 0;
            $scope.visitors = [];
            $scope.showInfo = false;
            $scope.selectedCompany = "";
        }

        function getVisitorsCallback(result){
            if(result.error){
                $scope.error =  result.statusText;
            }
            else {         
                $scope.cursor_skip = result.length;
                $scope.visitors = $scope.visitors.concat(result);       
            }
        }

        function getVisitorsTotalCallback(result){
            if(result.error){
                $scope.error =  result.statusText;
            }
            else {           
                $scope.cursor_total = result.cursor_total;       
            }
        }

        function callVisitorMethods () {
            var options = getOptions();
            clickyService.getVisitors(options, getVisitorsCallback);
            clickyService.getVisitorsTotal(options, getVisitorsTotalCallback); 
        }

        function getOptions() {
            var options = {
                date : $scope.date,
                skip : $scope.cursor_skip,
                limit : $scope.cursor_limit
            };

            if($scope.search){
                options.search = $scope.search;
            }
            return options;
        }

        $scope.showMore = function(){
            var options = getOptions();
            if(!$scope.stopScrolling){
                clickyService['getVisitors'](options , function showMoreCallback(result){
                    if(result.error){
                        $scope.error =  result.statusText;
                    }
                    else {         
                        $scope.cursor_skip = $scope.cursor_skip + result.length;
                        if(result.length == 0){
                            $scope.stopScrolling = !0;
                        }
                        $scope.visitors = $scope.visitors.concat(result);       
                    }
                });            
            }        
        };

        $scope.initSearch = function(){                
            resetScopeVar();                
            callVisitorMethods ();             
        }

        $scope.getvisitorsbydate = function(){
            resetScopeVar();                
            callVisitorMethods ();
        }

        $scope.getInfo = function (_id){            
            $scope.visitorsInfo = {};
            clickyService.getVisitorInfo(_id, function getvisitorsInfoCallBack(result){
                if(result.error){
                    $scope.error =  result.statusText;
                }
                else {                    
                    $scope.visitorsInfo = result;  
                    console.log($scope.visitorsInfo);     
                }
            });
        }

        $scope.advancedSearch = function(){
            var fields = $scope.searchFields;
            var search_obj = {};
            fields.forEach(function(field){
                var val = angular.element("#input_" + field.key).val();
                if(val){
                    search_obj[field.key] = val;
                }
            });
            if(Object.keys(search_obj).length){
                $scope.search = JSON.stringify(search_obj);
            }
            else
            {
                $scope.search = "";
            }
            
            console.log($scope.search);
            $scope.initSearch();
        }

        $scope.getvisitorsbydate();        
    }]);