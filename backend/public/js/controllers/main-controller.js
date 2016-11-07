

angular.module('myApp')
.controller('MainCtrl', function MainCtrl($http, $scope) {

    $scope.newProjectName = ''

    $scope.newProject = function() {
        if ($scope.newProjectName) {
            $http.post('/api/project/save', {'name': $scope.newProjectName})
            .success(function(response) {
                console.log(response)
                location.reload()
            }).error(function(response) {
                console.log('There was an error')
            })
        }
    }

    $scope.newCategory = function() {
        if ($scope.newCategoryName) {
            $http.post('/api/category/save', {'name': $scope.newCategoryName})
            .success(function(response) {
                console.log(response)
                location.reload()
            }).error(function(response) {
                console.log('There was an error')
            })
        }
    }
});