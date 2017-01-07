angular.module('viewCompanyControllerModule',[])
    .controller('viewCompanyController', ['$scope', 'companyService', '$window', function ($scope, companyService, $window) {
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
        var options = {
            skip : $scope.cursor_skip,
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
                $scope.companies = $scope.companies.concat(result);       
            }
        });  

        companyService.getCompanyTotal(options, function getCompanyTotalCallback(result){
            if(result.error){
                $scope.error =  result.statusText;
            }
            else {           
                $scope.cursor_total = result.cursor_total;       
            }
        });     

        $scope.showMore = function(){
            var options = {
                skip : $scope.cursor_skip,
                limit : $scope.cursor_limit
            };

            if($scope.search){
                options.search = $scope.search;
            }

            if(!$scope.stopScrolling){
                companyService['getCompany'](options , function showMoreCallback(result){
                    if(result.error){
                        $scope.error =  result.statusText;
                    }
                    else {         
                        $scope.cursor_skip = $scope.cursor_skip + result.length;
                        if(result.length == 0){
                            $scope.stopScrolling = !0;
                        }
                        $scope.companies = $scope.companies.concat(result);       
                    }
                });            
            }        
        };

        $scope.initSearch = function(){                
            $scope.cursor_skip = 0;
            $scope.cursor_limit = 200;
            $scope.stopScrolling = !1;
            $scope.cursor_total = 0;
            $scope.companies = [];
            $scope.showInfo = false;
            $scope.selectedCompany = "";
            var options = {
                skip : $scope.cursor_skip,
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
                    $scope.companies = $scope.companies.concat(result);       
                }
            });

            companyService['getCompanyTotal'](options, function getCompanyTotalCallback(result){
                if(result.error){
                    $scope.error =  result.statusText;
                }
                else {           
                    $scope.cursor_total = result.cursor_total;       
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
                var val = $scope['input_' + field.key];
                if(val){
                    search_obj[field.key] = val;
                }
            });
            $scope.search = JSON.stringify(search_obj);
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