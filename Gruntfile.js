/**
 * Created by Christophe on 02/09/2016.
 */
module.exports = function(grunt){

    grunt.initConfig({
        requirejs: {
            dist: {
                options: {
                    baseUrl: "",
                    mainConfigFile: 'config.js',
                    name: "modelmanager",
                    include: [],
                    out: 'dist/modelmanager.bundle.min.js'
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-requirejs');

    grunt.registerTask('default', ['dist']);
    grunt.registerTask("dist", ['requirejs:dist']);

};