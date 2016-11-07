var config = require('./config/config')

module.exports = function(grunt) {

	grunt.initConfig({
		watch: {
			jade: {
				files: ['server/views/**'],
				options: {
					livereload: true
				}
			},
			js: {
				files: ['public/js/**', 'server/models/*.js', 'server/controllers/*.js'],
				// tasks: ['jshint'],
				options: {
					livereload: true
				}
			},
			css: {
				files: ['public/sass/*.scss'],
				tasks: ['sass'],
				options: {
					livereload: true
				}
			}
		},

		nodemon: {
			dev: {
				script: 'server.js',
				options: {
					args: [],
					callback: function (nodemon) {
						nodemon.on('log', function (event) {
							console.log(event.colour);
						});
					},
					env: {
						PORT: config.PORT
					},
					cwd: __dirname,
					ignore: ['node_modules/**', 'README.md', '.DS_Store'],
					ext: 'js,coffee',
					watch: ['./'],
					delay: 1000,
					legacyWatch: true
				}
			},
		},

		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'public/css/main.css': 'public/sass/main.scss'
				}
			}
		},

		concurrent: {
			tasks: ['nodemon', 'watch', 'sass'],
			options: {
				logConcurrentOutput: true
			}
		}
	})

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-concurrent');

	// do not abort when error
	grunt.option('force', true);
	grunt.registerTask('default', ['concurrent']);
}