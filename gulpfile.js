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
        jsonPackage = require("./package.json");

    var jr = "components/scripts/js/",
        jsSources = [jr + "main.js",
                     jr + "managers/variables/generalVariableManager.js",
                     jr + "managers/variables/localStorageVariableManager.js"],
        sr = "components/swf/",
        swfSources = [sr + "bin/captivateextra.swf"],
        tr = "tests/output/",
        testSources = [tr + "01_CE_Local_Storage_Variables/wr/w_5235/scripts",
                       tr + "02_CE_Local_Storage_Variables_2/wr/w_5235/scripts",
                       tr + "02_CE_Local_Storage_Variables_2/wr/w_5495/scripts"],
        captivateExtraDevLocation = "builds/development/wdgt_source/html5/scripts",
        captivateExtraDevFileName = "captivate_extra.js";

    var buildNumber = jsonPackage.buildNumber;

    function iterateBuildNumber () {
        buildNumber += 1;

        gulp.src("./package.json")
                .pipe(gjsoneditor({
                    "buildNumber":buildNumber
                }))
                .pipe(gulp.dest("./"));

        return buildNumber;
    }


    gulp.task("compileJS" , function () {

        var bn = iterateBuildNumber();
        gutil.log("Build Number: " + bn);

        return gulp.src(jsSources)
                .pipe(gconcat(captivateExtraDevFileName))
                .pipe(greplace("$$VERSION_NUMBER$$",jsonPackage.version))
                .pipe(greplace("$$BUILD_NUMBER$$",bn))
                .pipe(gulp.dest(captivateExtraDevLocation));

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

    gulp.task("updateTests", ["compileJS"], function () {

        var piper = gulp.src(captivateExtraDevLocation + "/" + captivateExtraDevFileName);

        for (var i = 0; i < testSources.length; i+=1) {

            gutil.log("Copying Captivate Extra to: " + testSources[i]);
            piper.pipe(gulp.dest(testSources[i]));

        }

        // Refresh browser
        return piper.pipe(gconnect.reload());

    });






    ///// WATCHES
    // TO CANCEL A TASK RUNNING ON THE COMMAND LINE, HIT: Ctrl + c
    gulp.task("watch", function () {
        return gulp.watch(jsSources, ["updateTests"]);
    });



    ////// SERVER
    gulp.task("connect", function () {
        return gconnect.server({
            root: "tests/output",
            livereload: true
        });
    });


    ////////// DEFAULT
    gulp.task("default",["updateTests","moveSWFOutput","compileWidget","connect","watch"]);

}());

