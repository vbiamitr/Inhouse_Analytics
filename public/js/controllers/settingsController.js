angular.module('settingsControllerModule',[])
    .controller('settingsController', ['$scope', 'companyService', function ($scope, companyService) {
        $scope.Title = 'Settings';        
    }]);