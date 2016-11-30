angular.module('ih_app', [ 
    'ngRoute',
    'ngFileUpload',
    'utilityServiceModule',
    'companyServiceModule',
    'viewCompanyControllerModule',
    'uploadCompanyControllerModule',
    'settingsControllerModule'
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
    .otherwise("/");
})

.directive('scrolly', function () {
    return {
        restrict: 'A',
        link: function (scope, element, attrs) {
            var raw = element[0];
            element.bind('scroll', function () {               
                if (raw.scrollTop + raw.offsetHeight + 5 > raw.scrollHeight) {                    
                    scope.$apply(attrs.scrolly);
                }
            });
        }
    };
});
