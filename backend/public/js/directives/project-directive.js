/**
 * Directive: sidebar-directive
 */

angular.module('myApp')
.directive('project', function project($http, $timeout) {
	'use strict'

	return {
		restrict: 'EA',
		replace: true,
		scope: true,
		templateUrl: '/partials/project-tmpl',
		controllerAs: 'project',
		controller: function($scope) {
			var self = this

			this.fetchProjects = function() {
				$http.get('/api/project/list')
				.success(function(response) {
					$scope.projects = response;
					self.init();
				}).error(function(response) {
					console.log('There was an error')
				})
			}
			this.fetchProjects()

			this.init = function() {
				// default display website
				$scope.projects.forEach(function(project) {
					project.shouldDisplayWebsite = true;

					if (project.websites) {
						project.websites.forEach(function(website) {
							$scope.sortByLocation(website);
						})
					}
				})
			}

			$scope.computeColor = function(categoryName) {
				return ColorLuminance(stringToColour(categoryName), 3);

				// Credit: http://stackoverflow.com/a/16348977/4246348
				function stringToColour(str) {

				    // str to hash
				    for (var i = 0, hash = 0; i < str.length; hash = str.charCodeAt(i++) + ((hash << 5) - hash));

				    // int/hash to hex
				    for (var i = 0, colour = "#"; i < 3; colour += ("00" + ((hash >> i++ * 8) & 0xFF).toString(16)).slice(-2));

				    return colour;
				}

				// Credit: http://www.sitepoint.com/javascript-generate-lighter-darker-color/
				// get a lighter color
				function ColorLuminance(hex, lum) {

					// validate hex string
					hex = String(hex).replace(/[^0-9a-f]/gi, '');
					if (hex.length < 6) {
						hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
					}
					lum = lum || 0;

					// convert to decimal and change luminosity
					var rgb = "#", c, i;
					for (i = 0; i < 3; i++) {
						c = parseInt(hex.substr(i*2,2), 16);
						c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
						rgb += ("00"+c).substr(c.length);
					}

					return rgb;
				}
			}

			$scope.displayWebsite = function(project) {
				project.shouldDisplayWebsite = true;
			}

			$scope.displayCategory = function(project) {
				project.shouldDisplayWebsite = false;
				// format categories if needed
				if (!project.categories) {
					var categories = {};
					project.websites.forEach(function(website) {
						website.contents.forEach(function(content) {
							content.categories.forEach(function(category) {
								var categoryName = category.name;
								var _content = {
									text: content.text,
									_id: content._id,  // for star-rating directive
									rating: content.rating,
									title: website.title,  // add two fields
									url: website.url
								}
								if (categoryName in categories) {
									categories[categoryName].push(_content)
								} else {
									categories[categoryName] = [_content]
								}
							})
						})
					})
					project.categories = categories;
				}
			}

			$scope.sortByLocation = function(website) {
				// order by location in ascending order
				if (website.locationInAscendingOrder) {
					website.locationInAscendingOrder = false;
					website.contents.sort(function(a, b) {
						return b.location - a.location;
					})
				} else {
					website.locationInAscendingOrder = true;
					website.contents.sort(function(a, b) {
						return a.location - b.location;
					})
				}
			}


			$scope.sortByRating = function(website) {
				// order by rating in descending order by default
				if (website.ratingInDescendingOrder) {
					website.ratingInDescendingOrder = false;
					website.contents.sort(function(a, b) {
						return a.rating - b.rating;
					})
				} else {
					website.ratingInDescendingOrder = true;
					website.contents.sort(function(a, b) {
						return b.rating - a.rating;
					})
				}
			}

			$scope.deleteProject = function(project) {
				var r = confirm('Are you going to delete this project?')
				if (r) {
					$http.delete('/api/project/'+project._id)
					.success(function(response) {
						location.reload();
					}).error(function(response) {
						console.log('error')
					})
				} else {
					; // cancelled, do nothing
				}
			}

			$scope.deleteWebsite = function(website) {
				var r = confirm('Are you going to delete this website?')
				if (r) {
					$http.delete('/api/website/'+website._id)
					.success(function(response) {
						location.reload();
					}).error(function(response) {
						console.log('error')
					})
				} else {
					;  // cancelled
				}
			}

		},
		link: function($scope, element) {

			// Credit: http://stackoverflow.com/a/24228604/4246348
            // Trigger when number of children changes,
            // including by directives like ng-repeat
            var watch = $scope.$watch(function() {
                return element.children().length;
            }, function() {
                // Wait for templates to render
                $scope.$evalAsync(function() {
                    // Finally, directives are evaluated
                    // and templates are renderer here
                    collapse.init('hide')

                    // keep focus when modal is showing 
                    $('#new-category, #new-project').on('shown.bs.modal', function () {
					  $(this).find('input').focus()
					})
                    $('[data-toggle="tooltip"]').tooltip();
                });
            });
			var collapse = {
				hasInit: false,
				init: function(status) {
					// use the default status if not specified by 'data-init-status'
					this.handler()

					// show or hide based on the init status
					element.find('[data-toggle="toggle"]').each(function(obj) {
						var targetId = $(this).attr('data-target'),
							_status = $(this).attr('data-init-status') || status; // use its own status

						if (_status === 'show') {
							$(this).click();
						} else {
							$(targetId).hide();
						}
					})

				},
				handler: function() {
					if (this.hasInit) {
						return false;
					}
					element.on('click', '[data-toggle="toggle"]', function() {
						var btn = $(this),
							status = btn.attr('data-curr-status'),
							targetId = btn.attr('data-target'),
							target = element.find(targetId);

						// by default, collapse
						if (typeof status === 'undefined' || status === 'hide') {
							btn.attr('data-curr-status', 'show')
							btn.find('i.glyphicon-chevron-right')
								.removeClass('glyphicon-chevron-right')
								.addClass('glyphicon-chevron-down')
							target.show('fast')
						} else {
							btn.attr('data-curr-status', 'hide')
							btn.find('i.glyphicon-chevron-down')
								.removeClass('glyphicon-chevron-down')
								.addClass('glyphicon-chevron-right')
							target.hide('fast')
						}
					})
					this.hasInit = true;
				}
			}

		}
	}
})