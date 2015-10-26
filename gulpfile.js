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

    var gulp = require("gulp"),
        gutil = require("gulp-util"),
        gconcat = require("gulp-concat"),
        gzip = require("gulp-zip"),
        gconnect = require("gulp-connect"),
        greplace = require("gulp-replace"),
        gjsoneditor = require("gulp-json-editor"),
        path = require("path"),
        karma = require("karma"),
        karmaParseConfig = require("karma/lib/config").parseConfig,
        jsonPackage = require("./package.json");

    var jr = "components/scripts/js/dev/",
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


        captivateExtraDevLocation = "builds/development/wdgt_source/html5/scripts",
        captivateExtraDevFileName = "captivate_extra.js",
        ctr = "tests/output/captivate/",
        captivateTestSources = [ctr + "01_CE_Local_Storage_Variables/wr/w_5235/scripts",
                               ctr + "02_CE_Local_Storage_Variables_2/wr/w_5235/scripts",
                               ctr + "02_CE_Local_Storage_Variables_2/wr/w_5495/scripts",
                               ctr + "03_CE_TextEntryBox_Behaviour_Changes/wr/w_5235/scripts",
                               ctr + "05_CE_SlideTests/wr/w_5235/scripts",
                               ctr + "06_CE_Command_Variables/wr/w_5235/scripts",
                               ctr + "06_CE_Command_Variables/wr/w_5687/scripts",
                               ctr + "07_CE_Slide_Object_State_Tests/wr/w_5235/scripts"],

        storylineExtraDevLocation = "builds/development/storyline_extra_web_object",
        storylineExtraDevFileName = "storyline_extra.js",
        str = "tests/output/storyline/",
        storylineTestSources = [str + "01_CE_Local_Storage_Variables_1 - Storyline output/story_content/WebObjects/6O4Z2639lm4",
                                str + "01_CE_Local_Storage_Variables_2 - Storyline output/story_content/WebObjects/64qP4KPGj6t",
                                str + "02_SE_Slide_Tests - Storyline output/story_content/WebObjects/6pcKh8TGeK4",
                                str + "03_SE_State_Tests - Storyline output/story_content/WebObjects/6f6bu2xv9vO"],
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

    gulp.task("moveSWFOutput", function () {

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
                .pipe(gzip("CaptivateExtra.wdgt"))
                .pipe(gulp.dest("builds/development"));

    });




    //////////////////////////////////////
    ///////// UPDATING TEST FILES
    //////////////////////////////////////

    function replaceJSFileAtDestinations(jsFile,destinations) {
        var piper = gulp.src(jsFile);
        var result;

        for (var i = 0; i < destinations.length; i+=1) {

            gutil.log("Copying Extra to: " + destinations[i]);
            result = piper.pipe(gulp.dest(destinations[i]));

        }

        return result;
    }

    gulp.task("updateCaptivateTests", ["compileCaptivateJS"], function () {

        return replaceJSFileAtDestinations(captivateExtraDevLocation + "/" + captivateExtraDevFileName, captivateTestSources)
                .pipe(gconnect.reload());

        /*var piper = gulp.src(captivateExtraDevLocation + "/" + captivateExtraDevFileName);
        var result;

        for (var i = 0; i < captivateTestSources.length; i+=1) {

            gutil.log("Copying Captivate Extra to: " + captivateTestSources[i]);
            result = piper.pipe(gulp.dest(captivateTestSources[i]));

        }

        return result;*/
        // Refresh browser
        //return piper.pipe(gconnect.reload());

    });

    gulp.task("updateStorylineTests", ["compileStorylineJS"], function () {
        return replaceJSFileAtDestinations(storylineExtraDevLocation + "/" + storylineExtraDevFileName, storylineTestSources)
                .pipe(gconnect.reload());
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
    gulp.task("default",["updateCaptivateTests","updateStorylineTests","moveSWFOutput","compileWidget","connect","watch","test-dev"]);

}());

