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
        gconnect = require("gulp-connect");

    var jr = "components/scripts/js/",
        jsSources = [jr + "main.js", jr + "variableManager/variableManager.js"],
        sr = "components/swf/",
        swfSources = [sr + "bin/captivateextra.swf"],
        tr = "tests/output/",
        testSources = [tr + "01_CE_Local_Storage_Variables/wr/w_5235/scripts"],
        captivateExtraDevLocation = "builds/development/wdgt_source/html5/scripts",
        captivateExtraDevFileName = "captivate_extra.js";

    gulp.task("concat", function () {
        gulp.src(jsSources)
                .pipe(gconcat(captivateExtraDevFileName))
                .pipe(gulp.dest(captivateExtraDevLocation));
    });

    gulp.task("moveSWFOutput", function () {
        gulp.src(swfSources)
                .pipe(gulp.dest("builds/development/wdgt_source/swf"));
    });

    gulp.task("compileWidget", function () {
        gulp.src("builds/development/wdgt_source/**")
                .pipe(gzip("CaptivateExtra.wdgt"))
                .pipe(gulp.dest("builds/development"));
    });

    gulp.task("updateTests", function () {

        var piper = gulp.src(captivateExtraDevLocation + "/" + captivateExtraDevFileName);

        for (var i = 0; i < testSources.length; i+=1) {

            gutil.log("Copying Captivate Extra to: " + testSources[i]);
            piper.pipe(gulp.dest(testSources[i]));

        }

        // Refresh browser
        piper.pipe(gconnect.reload());

    });



    ///// WATCHES
    // TO CANCEL A TASK RUNNING ON THE COMMAND LINE, HIT: Ctrl + c
    gulp.task("watch", function () {
        gulp.watch(jsSources, ["concat","updateTests"]);
    });



    ////// SERVER
    gulp.task("connect", function () {
        gconnect.server({
            root: "tests/output",
            livereload: true
        });
    });


    ////////// DEFAULT
    gulp.task("default",["concat","moveSWFOutput","compileWidget","connect","watch","updateTests"]);

}());

