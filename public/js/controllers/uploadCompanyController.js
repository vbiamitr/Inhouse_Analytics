angular.module('uploadCompanyControllerModule',[])
    .controller('uploadCompanyController', ['$scope', 'Upload', '$timeout', '$routeParams',  '$filter' , 'utilityService', 'companyService',  function ($scope, Upload, $timeout, $routeParams, $filter, utilityService, companyService) {
        $scope.fields = Object.keys(companyService.fieldInfo);
        var url = utilityService.server_base_url + '/uploads/xlsx';
        $scope.type = $routeParams.type;
        $scope.uploadFiles = function (files) {
            $scope.files = files;
            if (files && files.length) {
                Upload.upload({
                    url: url,
                    data: {
                        files: files
                    }
                }).then(function (response) {
                    $timeout(function () {
                        $scope.result = response.data;
                        $scope.getCompanyFiles();
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
        $scope.getFieldInfo = function(field){
            if(field && companyService.fieldInfo){
                $scope.fieldInfo = companyService.fieldInfo[field].info || '';
                $scope.selectedField = field;
            }
        };

        $scope.selectFile = function(file){
            $scope.selectedFile = file.originalfile;
        }

        $scope.deleteFile = function(file){
            var url = utilityService.server_base_url + '/uploads/deletefile/' + file;
            utilityService.makeHttpRequest(url, function(result){
                console.log(result);
                $scope.getCompanyFiles();
            });
        };

        $scope.downloadFile = function(file){
            var url = utilityService.server_base_url + '/uploads/downloadfile/' + file;
            var downloadframe = angular.element( document.querySelector( '#download_frame' ) );
            downloadframe.attr('src',url);            
        }

        $scope.getCompanyFiles = function(){
            var url = utilityService.server_base_url + '/uploads/getcompanyfiles';
            utilityService.makeHttpRequest(url, function(result){
                //$scope.savedfiles = result.files;
                var files_dict = [];
                result.files.forEach(function(file){
                     var filename = file;
                     var ext_i = filename.lastIndexOf('.');
                     var tmp_i = filename.lastIndexOf('_');
                     var timestamp = filename.substring(tmp_i + 1 ,ext_i);
                     var newfilename = filename.substring(0, tmp_i) +  filename.substring(ext_i);
                     files_dict.push({
                        originalfile : filename,
                        name : newfilename,
                        created : $filter('date')(timestamp, 'medium')
                     });
                });
                $scope.savedfiles = files_dict;
            });
        };
        $scope.getCompanyFiles();       
    }]);