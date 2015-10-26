var fs = require('fs');

module.exports = function(grunt) {
    grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		ts: {
			build : {
				src: [
					'*.ts',
					'!*.d.ts'
				]
			}
		},
	});

	grunt.loadNpmTasks("grunt-ts");
};