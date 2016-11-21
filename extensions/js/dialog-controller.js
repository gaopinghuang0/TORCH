var isLocal = false;
var g_uri = isLocal ? 'http://localhost:3001' : 'http://torch.gaopinghuang.com';


angular.module('myApp', [])
.controller('DialogCtrl', function DialogCtrl($http, $scope) {

    $http.get(g_uri + '/api/init/info')
    .success(function(response) {
        if (response.projects) {
            $scope.projects = response.projects
            $scope.categories = response.categories
            // use last project
            $scope.selectedCategory = $scope.categories[0];
        }
    }).error(function(response) {
        console.log('error')
    })


    $scope.data = {}
    function setDomInfo(info) {
        $scope.$apply(function() {
            console.log(info.project)
            if (info.project) {
                // if project has not been saved, show dialog of project
                $scope.shouldContent = true;
                $scope.selectedProject = info.project
            } else {
                $scope.shouldContent = false;
                $scope.selectedProject = $scope.projects.slice(-1)[0];
            }
            $scope.data.inputTitle = info.title
            $scope.data.inputURL = info.url
            $scope.data.inputContent = info.text
            $scope.data.location = info.location
            $scope.data.isPDF = info.isPDF;
        })
    }

    // Credit: http://stackoverflow.com/a/13549245/4246348
    var port = chrome.extension.connect({name: "Sample Communication"});
    port.postMessage("Hi BackGround");
    port.onMessage.addListener(function(msg) {
        setDomInfo(msg)
    });
    // exports
    window.port = port;


    $scope.shouldContent = false;
    $scope.showContent = function() {
        $scope.shouldContent = true;
    }


    $scope.closeWindow = function() {
        window.close()
    }

    $scope.save = function(e) {
        var data = {
            project_id: $scope.selectedProject._id,
            title: $scope.data.inputTitle,
            text: $scope.data.inputContent,
            url: $scope.data.inputURL,
            location: $scope.data.location,
            isPDF: $scope.data.isPDF,
            rating: parseInt($('.rating-value').val()),
            category_id: $scope.selectedCategory._id
        }
        console.log(data)
        $.ajax({
            method: 'POST',
            url: g_uri + '/api/website/save',
            data: data
        }).success(function(response) {
            console.log(response)
            window.close()
        }).error(function(response) {
            console.log('popup server error')
            window.close()
        })
    }

});