var xlsx_app = angular.module('xlsx_app', ['ngFileUpload']);

xlsx_app.controller('MyCtrl', ['$scope', 'Upload', '$timeout', function ($scope, Upload, $timeout) {
    $scope.uploadFiles = function (files) {
        $scope.files = files;
        if (files && files.length) {
            Upload.upload({
                url: 'http://localhost:3000/uploads/xlsx',
                data: {
                    files: files
                }
            }).then(function (response) {
                $timeout(function () {
                    $scope.result = response.data;
                });
            }, function (response) {
                if (response.status > 0) {
                    $scope.errorMsg = response.status + ': ' + JSON.stringify(response.data);
                }
            }, function (evt) {
                $scope.progress = 
                    Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
            });
        }
    };
}]);