
/**
 * Directive: sidebar-directive
 */

angular.module('myApp')
.directive('starRating', function starRating($http, $timeout) {
    'use strict'

    return {
        restrict: 'EA',
        replace: true,
        scope: {
            max: '@',
            content: '=',
        },
        templateUrl: '/partials/star-rating-tmpl',
        controllerAs: 'star',
        link: function($scope, element) {
            $scope.max = parseInt($scope.max) || 3;

            $scope.ratings = [];
            for (var i=1; i<$scope.max+1; i++) {
                $scope.ratings.push(i);
            }

            $scope.init = function() {
                var $star_rating = element.find('.glyphicon')
                $scope.SetRatingStar = function() {
                  return $star_rating.each(function() {
                    if ($scope.content.rating >= parseInt($(this).data('rating'))) {
                      return $(this).removeClass('glyphicon-star-empty').addClass('glyphicon-star');
                    } else {
                      return $(this).removeClass('glyphicon-star').addClass('glyphicon-star-empty');
                    }
                  });
                };
            }

            $timeout(function() {
                $scope.init()
                $scope.SetRatingStar();
            }, 0)


            $scope.updateRating = function(rating) {
                $http.post('/api/content/rating', {_id: $scope.content._id, rating: rating})
                .success(function(response) {
                    $scope.content.rating = rating;
                    $scope.SetRatingStar();
                }).error(function(response) {
                    console.log("error");
                })
                
            }
        }
    }
})
