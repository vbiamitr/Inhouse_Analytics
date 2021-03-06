angular.module('viewContactControllerModule',[])
    .controller('viewContactController', ['$scope', 'companyService', '$window', '$compile', '$routeParams', function ($scope, companyService, $window, $compile, $routeParams) {
        var collectionName = "contact",
            collectionObj = {
                collection : collectionName
            },
            customService = companyService.initMethods(collectionObj),
            elementIdToUpdate = {};

        $scope.updateComment = customService.updateComment;
        $scope.deleteComment = customService.deleteComment;               
        $scope.recordsInfo = {};        
        $scope.colsw = 100;
        $scope.fields = [];  
        $scope.fieldInfo = {};
        $scope.param = $routeParams.domain;
        

        function updatePages(){
            var totalPages = Math.floor($scope.cursor_total / $scope.cursor_limit) + 1;            
            var diff = 5;
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

        function getFieldsCallback(result){
            if(result.error){
                $scope.error =  result.statusText;
            }
            else {         
                $scope.fields = result.fields.slice(0);
            }

            if($scope.param){
                var defaultSearchObj = {
                    "companyDomain" : $scope.param
                };
                $scope.advancedSearch(defaultSearchObj);
            }
            else
            {
                $scope.initSearch();
            }            
        }

        function getFieldsInfoCallback(result){
            if(result.error){
                $scope.error =  result.statusText;
            }
            else {         
                delete result._id;                
                $scope.fieldInfo = $.extend({}, result);
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

        $scope.getInfo = function (_id){
            $scope.recordsInfo = {};
            var options = {
                "_id" : _id
            };
            customService.getRecordInfo(options, getRecordInfoCallBack);
        };

        $scope.advancedSearch = function(defaultSearch){
            var fields = $scope.fields;
            var search_obj = {};
            if(defaultSearch){
                for(var key in defaultSearch){
                    search_obj[key] = defaultSearch[key];
                }
            }
            else
            {
                fields.forEach(function(field){
                    var ele = angular.element( document.querySelector( '#adv_input_' + field ));
                    if(ele.val()){
                        search_obj[field] = ele.val();
                    }                
                });
            }
            
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

        $scope.allowEditing = function(eleId){
            var ele = angular.element( document.querySelector( '#' + eleId ));            
            ele.removeAttr('disabled');
            ele.addClass('allow-edit');
            ele.focus();
        };

        $scope.saveEditing = function(eleId){
            var ele = angular.element( document.querySelector( '#' + eleId )),
                val = ele.val(),
                options = {};
            ele.attr('disabled', 'disabled');
            if($scope.recordsInfo[eleId] !== val){
                elementIdToUpdate.id = eleId;
                elementIdToUpdate.val = val;
                options = {
                    "_id" : $scope.recordsInfo._id,
                    "field" : eleId,
                    "val" : val
                }
                customService.updateRecordInfo(options, updateRecordInfoCallback);               
            }
        };

        $scope.removeComments = function(){
            var ul = $('#commentList'); 
            ul.find('.list-group-item').remove();            
        };        

        $scope.appendComment = function(_id){
            var ul = $('#commentList'); 
            var li = $compile('<addcommentbox docid="'+_id+ '" commentobj="" collectionname="'+collectionName+'"></addcommentbox>')($scope);       
            ul.append(li);
        }

        
        
        customService.getFields({}, getFieldsCallback);
        customService.getFieldsInfo({}, getFieldsInfoCallback);
         
        
    }]);