angular.module('ih_app', [ 
    'ngRoute',
    'ngFileUpload',     
    'utilityServiceModule',
    'companyServiceModule',
    'clickyServiceModule',
    'viewCompanyControllerModule',
    'uploadCompanyControllerModule',
    'settingsControllerModule',
    'clickyControllerModule'
])

.config(function($routeProvider) {
    $routeProvider
    .when("/upload/:type", {
        templateUrl : "/public/views/uploads.html",
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
    .otherwise("/");
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
               var tblWidth = element.width();
               tblWidth = tblWidth - 30;
                                
                scope.colswidth = tblWidth / scope.colfields.length;
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
        template : '<div class="input-group date" id="datetimepicker1"> <input type="text" ng-model="requireddate" class="form-control" /> <span class="input-group-addon"> <span class="glyphicon glyphicon-calendar"></span></span></div>',
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
}]);