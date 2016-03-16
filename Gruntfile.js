module.exports = function(grunt){

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		banner: '/*\n' +
			' * <%= pkg.name %> - version <%= pkg.version %> - <%= grunt.template.today("dd-mm-yyyy") %>\n' +
			' * <%= pkg.author %>\n' +
			' */',
		
		usebanner: {
			dist: {
				options: {
					position: 'top',
					banner: '<%= banner %>'
				},
				files: {
					src: ['./dist/*.js']
				}
			}
		},

		babel: {
			options: {
				sourceMap: true
			},
			dist: {
				files: {'./dist/imagify-gulp.js': './src/*.js'}
			}
		},

		uglify: {
			options: {
				mangle: true,
				sourceMap: false
			},
			dist: {
				files: {
					'./dist/imagify-gulp.min.js': ['./dist/imagify-gulp.js']
				}
			}
		},

		watch: {
			scripts: {
				files: ['src/*.js'],
				tasks: ['babel', 'uglify', 'usebanner']
			}
		},

		notify_hooks: {
			options: {
				enabled: true,
				max_jshint_notifications: 2,
				title: '<%= pkg.name %>',
				success: true,
				duration: 1
			}
		}

	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-notify');
	grunt.loadNpmTasks('grunt-banner');
	grunt.loadNpmTasks('grunt-babel');

	grunt.task.run('notify_hooks');
	
	grunt.registerTask('default', ['babel', 'uglify', 'usebanner']);

}