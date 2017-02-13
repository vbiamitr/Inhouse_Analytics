angular.module('ih_app', [ 
    'ngRoute',
    'ngFileUpload',     
    'utilityServiceModule',
    'companyServiceModule',
    'clickyServiceModule',
    'viewCompanyControllerModule',
    'uploadCompanyControllerModule',
    'settingsControllerModule',
    'clickyControllerModule',
    'ipCheckControllerModule',
    'contactControllerModule',    
    'viewContactControllerModule'
])

.config(function($routeProvider) {
    $routeProvider
    .when("/upload/:type", {
        templateUrl : "/public/views/upload_company.html",
        controller: "uploadCompanyController"
    })
    .when("/view_company", {
        templateUrl : "/public/views/view_company.html",
        controller: "viewCompanyController"
    })
    .when("/schema_settings", {
        templateUrl : "/public/views/schema_settings.html",
        controller: "settingsController"
    })
    .when("/clicky", {
        templateUrl : "/public/views/clicky.html",
        controller: "clickyController"
    })
    .when("/ipcheck", {
        templateUrl : "/public/views/ipcheck.html",
        controller: "ipCheckController"
    })
    .when("/upload-contact", {
        templateUrl : "/public/views/upload_contacts.html",
        controller: "contactController"
    })
    .when("/view-contact", {
        templateUrl : "/public/views/view_contacts.html",
        controller: "viewContactController"
    })
    .when("/view-contact/:domain", {
        templateUrl : "/public/views/view_contacts.html",
        controller: "viewContactController"
    })
    .otherwise("/view_company");
})

.directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            element.bind('scroll', function () {               
                if (raw.scrollTop + raw.offsetHeight > raw.scrollHeight) {
                    console.log("scrollY : scrollTop=" + raw.scrollTop + "; scrollHeight="+ raw.scrollHeight+ "; offsetHeight="+raw.offsetHeight);                   
                    scope.$apply(attrs.scrolly);
                }
            });
        }
    };
})

.directive('companytbl', ['$window', function($window){
    return {
        restrict : 'A',
        scope:{
           colswidth: '=',
           colfields : '=' 
        },
        link: function(scope, element, attrs){          
                
                scope.$watch('colfields', function(newValue, oldValue){
                    var tblWidth = element.width();
                    tblWidth = tblWidth - 30;               
                    scope.colswidth = tblWidth / scope.colfields.length;                    
                });
                
                angular.element($window).bind('load resize', function(){                    
                    var tblWidth = element.width();
                     tblWidth = tblWidth - 30;               
                    scope.colswidth = tblWidth / scope.colfields.length;
                    angular.element("th, td").css({
                        width : scope.colswidth + 'px'
                    });
                    scope.$digest();
                });
        }
    }
}])

.directive('datetimepicker', ['$window', function($window){
    return {
        restrict : 'E',
        replace : true,
        template : '<div class="input-group date" id="datetimepicker1"> <input type="text" ng-model="requireddate" class="form-control form-control-sm" /> <span class="input-group-addon"> <span class="glyphicon glyphicon-calendar"></span></span></div>',
        scope:{
           requireddate: '=',
           getvisitors: '&'          
        },
        link: function(scope, element, attrs){                 
            element.datetimepicker({
                    useCurrent: false,
                    format: 'YYYY-MM-DD',
                    defaultDate: scope.requireddate
            });

            element.on('dp.change', function(e){
                scope.requireddate = moment(e.date).format('YYYY-MM-DD');
                console.log("requireddate=" + scope.requireddate);    
                scope.$apply();               
                scope.getvisitors();
            });                      
        }
    }
}])

.directive('listcomment', ['companyService', '$filter', function(companyService, $filter){
    return {
        restrict : 'E',
        replace : true,
        scope:{
            commentobj: '=' ,
            docid : '@',
            collectionname : '@'                   
        },
        template : '<li class="list-group-item"><div class="comment-data">{{ commentobj.text }}</div><div class="comment-edit-delete-div"><span class="comment-date" >{{ commentobj.date | date:\'yyyy-MM-dd HH:mm:ss\' }}</span><span class="glyphicon glyphicon-pencil comment-btn comment-edit-btn"></span> <span class="glyphicon glyphicon-trash comment-btn comment-delete-btn"></span></div></li>',        
        link: function(scope, element, attrs){
             var el = element;
             var collectionObj = {
                 collection : scope.collectionname
             };

             var customService = companyService.initMethods(collectionObj, ['updateComment', 'deleteComment']); 

             el.on("click", ".cancel-comment", function(){
                el.remove();
             }); 

             el.on("click", ".save-comment", function(){
                 var val = el.find(".comment-textarea").val();  
                 var options = {
                    "_id" : scope.docid,
                    "jsdate" : scope.commentobj.date || -1,
                    "val" : val
                 }; 
                 customService.updateComment(options, function updateCompanyCommentCallback(result){
                    if(result.error){
                        console.log("Error : " + result.statusText);
                    }
                    else{
                        
                        el.empty();
                        scope.commentobj = {};
                        scope.commentobj.text = val;
                        scope.commentobj.date = result.date;
                        var formatedDate = $filter('date')(scope.commentobj.date, 'yyyy-MM-dd HH:mm:ss');
                        el.append('<div class="comment-data">' + val +'</div><div class="comment-edit-delete-div"><span class="comment-date" >' + formatedDate + '</span><span class="glyphicon glyphicon-pencil comment-btn comment-edit-btn"></span> <span class="glyphicon glyphicon-trash comment-btn comment-delete-btn"></span></div>');  
                        // save in database  
                    }
                });
                 
             });

             el.on("click", ".comment-edit-btn", function(){
                 var val = el.find(".comment-data").text();
                 el.empty();
                 el.append('<textarea class="comment-textarea enable-textarea">' + val + '</textarea><div class="comment-action"><button class="save-comment">Save</button><button data-comment="'+ val + '" class="cancel-comment-edit">Cancel</button></div>');
             });

             el.on("click", ".cancel-comment-edit", function(){
                 var val = $(this).data("comment");
                 el.find('.comment-textarea').val(val);          
                 el.find('.save-comment').click();  
             });

             el.on("click", ".comment-delete-btn", function(){
                 el.remove();
                 // delete from database
                 var options = {
                    "_id" : scope.docid,
                    "jsdate" : scope.commentobj.date || -1
                 };
                 customService.deleteComment(options , function updateCompanyCommentDeleteCallback(result){
                     if(result.error){
                        console.log("Error : " + result.statusText);
                    }
                    else{
                        
                       console.log("Comment deleted successfully");
                        // save in database  
                    }
                 });
             });
        }
    };

}])

.directive('addcommentbox', ['companyService', '$filter', function(companyService, $filter){
    return {
        restrict : 'E',
        replace : true,
        template : '<li class="list-group-item"><textarea class="comment-textarea enable-textarea"></textarea><div class="comment-action"><button class="save-comment">Save</button><button class="cancel-comment">Cancel</button></div></li>',
        scope:{ 
            commentobj: '@',
            docid : '@',
            collectionname : '@'                   
        },
        link: function(scope, element, attrs){                 
             var el = element;
             var collectionObj = {
                 collection : scope.collectionname
             };

             var customService = companyService.initMethods(collectionObj, ['updateComment', 'deleteComment']); 
             
             el.on("click", ".cancel-comment", function(){
                el.remove();
             }); 

             el.on("click", ".save-comment", function(){
                 var val = el.find(".comment-textarea").val();
                 var options = {
                    "_id" : scope.docid,
                    "jsdate" : scope.commentobj.date || -1,
                    "val" : val
                 };       
                 customService.updateComment(options, function updateCompanyCommentCallback(result){
                    if(result.error){
                        console.log("Error : " + result.statusText);
                    }
                    else{
                        
                        el.empty();
                        scope.commentobj = {};
                        scope.commentobj.text = val;
                        scope.commentobj.date = result.date;
                        var formatedDate = $filter('date')(scope.commentobj.date, 'yyyy-MM-dd HH:mm:ss');
                        el.append('<div class="comment-data">' + val +'</div><div class="comment-edit-delete-div"><span class="comment-date" >' + formatedDate + '</span><span class="glyphicon glyphicon-pencil comment-btn comment-edit-btn"></span> <span class="glyphicon glyphicon-trash comment-btn comment-delete-btn"></span></div>');  
                        // save in database  
                    }
                });  
             });

             el.on("click", ".comment-edit-btn", function(){
                 var val = el.find(".comment-data").text();
                 el.empty();
                 el.append('<textarea class="comment-textarea enable-textarea">' + val + '</textarea><div class="comment-action"><button class="save-comment">Save</button><button data-comment="'+ val + '" class="cancel-comment-edit">Cancel</button></div>');
             });

             el.on("click", ".cancel-comment-edit", function(){
                 var val = $(this).data("comment");
                 el.find('.comment-textarea').val(val);          
                 el.find('.save-comment').click();  
             });

             el.on("click", ".comment-delete-btn", function(){
                 el.remove();
                 // delete from database
                 var options = {
                    "_id" : scope.docid,
                    "jsdate" : scope.commentobj.date || -1                   
                 };  
                 customService.deleteComment(options , function updateCompanyCommentDeleteCallback(result){
                     if(result.error){
                        console.log("Error : " + result.statusText);
                    }
                    else{
                        
                       console.log("Comment deleted successfully");
                        // save in database  
                    }
                 });
             });            
        }
    }
}]);