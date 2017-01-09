angular.module('viewCompanyControllerModule',[])
    .controller('viewCompanyController', ['$scope', 'companyService', '$window', function ($scope, companyService, $window) {
        var updatePages = function(){
            var totalPages = Math.floor($scope.cursor_total / $scope.cursor_limit) + 1;
            $scope.totalPages = totalPages;
            $scope.pages.length = 0;
            var diff = 5;
            var page = $scope.page;
            var pageMin = page - diff;
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
            $scope.recordStart = (page - 1) * $scope.cursor_limit + 1;
            $scope.recordEnd = $scope.recordStart + $scope.companies.length - 1;                    
        };  

        
        $scope.cursor_skip = 0;
        $scope.cursor_limit = 200;
        $scope.stopScrolling = !1;
        $scope.cursor_total = 0;
        $scope.companies = [];
        $scope.companyInfo = {};
        $scope.showInfo = false;
        $scope.selectedCompany = "";
        $scope.colsw = 100;
        $scope.fields = companyService.fields;  
        $scope.fieldInfo = companyService.fieldInfo;
        $scope.pages = [];  
        $scope.page = 1;
        $scope.recordStart = 1;
        $scope.recordEnd = $scope.page * $scope.companies.length;
        var options = {
            skip : ($scope.page - 1) * $scope.cursor_limit,
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
                $scope.companies.length = 0;
                $scope.companies = $scope.companies.concat(result);       
            }
        });  

        companyService.getCompanyTotal(options, function getCompanyTotalCallback(result){
            if(result.error){
                $scope.error =  result.statusText;
            }
            else {           
                $scope.cursor_total = result.cursor_total;  
                updatePages();
            }
        });   

        

        $scope.showMore = function(page){
            if(page < 1 || page > $scope.totalPages){
                return;
            }
            $scope.page = page;
            var options = {
                skip : ($scope.page - 1) * $scope.cursor_limit,
                limit : $scope.cursor_limit
            };

            if($scope.search){
                options.search = $scope.search;
            }
            
            companyService['getCompany'](options , function showMoreCallback(result){
                if(result.error){
                    $scope.error =  result.statusText;
                }
                else {         
                    $scope.cursor_skip = $scope.cursor_skip + result.length;                    
                    $scope.companies.length = 0;
                    $scope.companies = $scope.companies.concat(result);
                    updatePages();        
                }
            });            
                    
        };

        $scope.initSearch = function(){                
            $scope.cursor_skip = 0;
            $scope.cursor_limit = 200;
            $scope.stopScrolling = !1;
            $scope.cursor_total = 0;
            $scope.companies = [];
            $scope.showInfo = false;
            $scope.selectedCompany = "";
            $scope.pages = [];  
            $scope.page = 1;
            var options = {
                skip : ($scope.page - 1) * $scope.cursor_limit,
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
                    $scope.companies.length = 0;
                    $scope.companies = $scope.companies.concat(result);  
                    updatePages();     
                }
            });

            companyService['getCompanyTotal'](options, function getCompanyTotalCallback(result){
                if(result.error){
                    $scope.error =  result.statusText;
                }
                else {           
                    $scope.cursor_total = result.cursor_total; 
                    updatePages();      
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
                var ele = angular.element( document.querySelector( '#adv_input_' + field ));
                if(ele.val()){
                    search_obj[field] = ele.val();
                }
            });
            $scope.search = JSON.stringify(search_obj);
            console.log($scope.search);
            $scope.initSearch();
        };

        $scope.showConfiguredFields = function(){
            $scope.showFieldsConfig = !$scope.showFieldsConfig;
            var chkboxEle = angular.element(document.querySelectorAll(".field-chkbox:checked"));
            var newFields = [];
            chkboxEle.each(function(i){
                newFields.push(chkboxEle[i].value);
            });

            if(newFields.join() !== $scope.fields.join()){            
                $scope.fields.length = 0;
                $scope.fields = $scope.fields.concat(newFields);
                $scope.initSearch();
            }                      
            
        }
    }]);