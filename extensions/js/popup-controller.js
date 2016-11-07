
angular.module('myApp', [])

angular.module('myApp')
.controller('PopupCtrl', function PopupCtrl($http, $scope) {
    'use strict'
    $scope.contents = [];

    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        var currTab = tabs[0],
            url = currTab.url;
            console.log(currTab)
        if (url) {
            $http.post('http://localhost:3000/api/content/list', {url: url})
            .success(function(response) {
                $scope.contents = response;
            }).error(function(response) {
                console.log('error');
            })
        }
    })

    $scope.jumpTo = function(content) {
        var msg = {
            message: "scroll_content",
            from: 'popup',
            location: content.location,
            text: content.text
        }
        // ask content script to scroll
        // Credit: https://developer.chrome.com/extensions/messaging
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, msg, function(response) {
            console.log(response);
          });
        });
    }


    // $http.get('http://localhost:3000/api/init/info')
    // .success(function(response) {
    //     if (response.projects) {
    //         $scope.projects = response.projects
    //         $scope.categories = response.categories
    //         $scope.selectedProject = $scope.projects[0];
    //         $scope.selectedCategory = $scope.categories[0];
    //     }
    // }).error(function(response) {
    //     console.log('error')
    // })

    // $scope.getContents = function(e) {
    //     chrome.runtime.sendMessage({directive: "popup-click"}, function(response) {
    //         this.close(); // close the popup when the background finishes processing request
    //     });
    // }

    // // Credit: http://stackoverflow.com/a/13549245/4246348
    // var PopupPort = chrome.extension.connect({name: "Sample Communication"});
    // PopupPort.postMessage("Hi BackGround");
    // PopupPort.onMessage.addListener(function(msg) {
    //     setDomInfo(msg)
    // });
    // // exports
    // window.PopupPort = PopupPort;


    // $scope.save = function(e) {
    //     var data = {
    //         project_id: $scope.selectedProject._id,
    //         title: $scope.data.inputTitle,
    //         text: $scope.data.inputContent,
    //         url: $scope.data.inputURL,
    //         location: $scope.data.location,
    //         rating: parseInt($('.rating-value').val()),
    //         category_id: $scope.selectedCategory._id
    //     }
    //     console.log(data)
    //     $.ajax({
    //         method: 'POST',
    //         url: 'http://localhost:3000/api/website/save',
    //         data: data
    //     }).success(function(response) {
    //         console.log(response)
    //         window.close()
    //     }).error(function(response) {
    //         console.log('popup server error')
    //         window.close()
    //     })
    // }

});

