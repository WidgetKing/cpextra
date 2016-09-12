/*global require*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 22/09/15
 * Time: 11:54 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    /*
    * Copyright Infosemantics 2016
    *
    * Permission is extended to owners of legitimate licences of this product to use this software in their projects,
    * whether they be commercial or otherwise. However, you may not sell, share, or pass on this software to be used
    * or installed into Captivate installations that are not owned by the licence holder for this product.
    */

    var gulp = require("gulp"),
        gutil = require("gulp-util"),
        gconcat = require("gulp-concat"),
        gzip = require("gulp-zip"),
        gconnect = require("gulp-connect"),
        greplace = require("gulp-replace"),
        grename = require("gulp-rename"),
        gflatmap = require('gulp-flatmap'),
        uglify = require("gulp-uglify"),
        gjsoneditor = require("gulp-json-editor"),
        path = require("path"),
        karma = require("karma"),
        karmaParseConfig = require("karma/lib/config").parseConfig,
        jsonPackage = require("./package.json");

    var env = process.env.NODE_ENV || 'development',
        jr = "components/scripts/js/dev/",
        jsCaptivateSources = [jr + "main.js",
                     jr + "**/!(*.storyline.js)"],
                     /*jr + "classes/callback.js",
                     jr + "managers/variables/generalVariableManager.captivate.js",
                     jr + "managers/variables/localStorageVariableManager.js",
                     jr + "managers/data/generalDataManager.js",
                     jr + "managers/slide/generalSlideManager.js",
                     jr + "managers/slideObjects/generalSlideObjectManager.js",
                     jr + "managers/behaviour/textBoxBehaviourManager.js",
                     jr + "classes/variableChangeMonitor.js"],*/
        jsStorylineSources = [jr + "main.js",
                     jr + "**/!(*.captivate.js)"],
        sr = "components/swf/",
        swfSources = [sr + "bin/captivateextra.swf"],


        versionJSONSource = "components/scripts/json/version.json",
        versionJSONDestination = "builds/development/wdgt_source/swf",
        captivateExtraDevLocation = "builds/development/wdgt_source/html5/scripts",
        captivateExtraDevFileName = "captivate_extra.js",
        headlessCaptivateBaseFileName = "Infosemantics_CpExtra",
        ctr = "tests/output/captivate/",
        cbtr = "tests/output/_BETA_TESTS/captivate/",
        uir = "tests/output/_USER_ISSUES/",

        storylineExtraDevLocation = "builds/development/storyline_extra_web_object",
        storylineExtraDevFileName = "storyline_extra.js",
        karmaConfig = "karma.conf.js";

    var buildNumber = jsonPackage.buildNumber;




    //////////////////////////////////////
    ///////// KARMA
    //////////////////////////////////////
    function runKarma(configFilePath, options, cb) {
        configFilePath = path.resolve(configFilePath);

        var log = gutil.log,
            colours = gutil.colors,
            config = karmaParseConfig(configFilePath, {}),
            server;

        Object.keys(options).forEach(function (key) {
            config[key] = options[key];
        });

        server = new karma.Server(config, function(exitCode) {
            log("Karma has exited with " + colours.red(exitCode));
            cb();
            process.exit(exitCode);
        });
        server.start();
    }

    gulp.task("test", function(cb) {
        runKarma(karmaConfig, {
            autoWatch: false,
            singleRun: true
        }, cb);
    });

    gulp.task("test-dev", function(cb) {
        runKarma(karmaConfig, {
            autoWatch: true,
            singleRun: false
        }, cb);
    });




    //////////////////////////////////////
    ///////// TASKS
    //////////////////////////////////////

    function iterateBuildNumber () {
        buildNumber += 1;

        gulp.src("./package.json")
                .pipe(gjsoneditor({
                    "buildNumber":buildNumber
                }))
                .pipe(gulp.dest("./"));

        return buildNumber;
    }

    function concatFiles(glob,fileName,destination) {
        return gulp.src(glob)
                        .pipe(gconcat(fileName))
                        .pipe(greplace("$$VERSION_NUMBER$$",jsonPackage.version))
                        .pipe(greplace("$$BUILD_NUMBER$$",buildNumber))
                        .pipe(uglify())
                        .pipe(gulp.dest(destination));
    }

    gulp.task("iterateBuildNumber", function () {
        gutil.log("Build Number: " + iterateBuildNumber());
    });

    gulp.task("compileCaptivateJS" , function () {

        return concatFiles(jsCaptivateSources, captivateExtraDevFileName, captivateExtraDevLocation);

    });

    gulp.task("compileStorylineJS", function () {

        return concatFiles(jsStorylineSources, storylineExtraDevFileName, storylineExtraDevLocation);

    });

    gulp.task("moveVersionJSON", function () {
        return gulp.src(versionJSONSource)
                .pipe(greplace("$$VERSION_NUMBER$$",jsonPackage.version))
                .pipe(greplace("$$BUILD_NUMBER$$",buildNumber))
                .pipe(gulp.dest(versionJSONDestination));
    });

    gulp.task("moveSWFOutput", ["moveVersionJSON"], function () {

        return gulp.src(swfSources)
                .pipe(gulp.dest("builds/development/wdgt_source/swf"));

    });

    gulp.task("compileWidgetDescription", function () {

        return gulp.src("components/scripts/xml/description.xml")
                .pipe(greplace("$$VERSION_NUMBER$$",jsonPackage.version))
                .pipe(gulp.dest("builds/development/wdgt_source"));

    });

    gulp.task("compileWidget", ["compileWidgetDescription"], function () {

        return gulp.src("builds/development/wdgt_source/**")
                .pipe(gzip("Infosemantics_CpExtra.wdgt"))
                .pipe(gulp.dest("builds/development"));

    });

    gulp.task("moveFilesToProduction", function () {
        return gulp.src("builds/development/wdgt_source/**")
                        //.pipe(gzip("CpExtra.wdgt"))
                        .pipe(gulp.dest("builds/production/wdgt_source"));
    });

    gulp.task("uglifyProductionCode", function () {

        return gulp.src("builds/development/wdgt_source/html5/scripts/captivate_extra.js")
                        .pipe(uglify())
                        .pipe(gulp.dest("builds/production/wdgt_source/html5/scripts"));

    });

    gulp.task("compileWidgetForProduction", ["compileWidgetDescription", "moveFilesToProduction", "uglifyProductionCode"], function () {

        gulp.src("builds/production/wdgt_source/**")
                        .pipe(gzip("Infosemantics_CpExtra.wdgt"))
                        .pipe(gulp.dest("builds/production"));

        return gulp.src("builds/production/wdgt_source/html5/scripts/captivate_extra.js")
                .pipe(grename({
                    basename: "Infosemantics_CpExtra"
                }))
                .pipe(gulp.dest("builds/production"));
    });



    //////////////////////////////////////
    ///////// UPDATING TEST FILES
    //////////////////////////////////////

    function updateOnGlob(glob, devFile) {

        function getDirectoryPath(path) {
            var lastSlash = path.lastIndexOf("\\");
            return path.substring(0,lastSlash);
        }

        // Loop through files matching glob
        return gulp.src(glob)
            .pipe(gflatmap(function(stream, file){

                // Uncomment to get list of files matching glob
                //gutil.log(getDirectoryPath(file.path));
                //return stream;
                // Get location of compiled CpExtra
                gulp.src(devFile)
                    // Save the new version over the currently located CpExtra instance
                    .pipe(gulp.dest(getDirectoryPath(file.path)));


                return stream;

            }))
            .pipe(gconnect.reload());

    }

    gulp.task("updateCaptivateTests", ["compileCaptivateJS"], function () {

        return updateOnGlob("tests/output/**/@(Infosemantics_CpExtra.js|captivate_extra.js)",
                            captivateExtraDevLocation + "/" + captivateExtraDevFileName);

    });

    gulp.task("updateStorylineTests", ["compileStorylineJS"], function () {
        return updateOnGlob("tests/output/**/storyline_extra.js",
            storylineExtraDevLocation + "/" + storylineExtraDevFileName);
    });





    ///// WATCHES
    // TO CANCEL A TASK RUNNING ON THE COMMAND LINE, HIT: Ctrl + c
    gulp.task("watch", function () {
        return gulp.watch(["components/scripts/js/**/*.js"], ["iterateBuildNumber", "updateCaptivateTests", "updateStorylineTests"]);
    });



    ////// SERVER
    gulp.task("connect", function () {
        return gconnect.server({
            root: "tests/output",
            livereload: true
        });
    });


    ////////// DEFAULT
    gulp.task("default",["updateCaptivateTests","updateStorylineTests","moveVersionJSON","compileWidget","connect","watch","test-dev"]);

}());

