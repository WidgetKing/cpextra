/*global require*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 22/09/15
 * Time: 11:54 AM
 * To change this template use File | Settings | File Templates.
 */
(function() {
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
    gflatmap = require("gulp-flatmap"),
    ginsert = require("gulp-insert"),
    gglob = require("glob"),
    uglify = require("gulp-uglify"),
    gjsoneditor = require("gulp-json-editor"),
    path = require("path"),
    karma = require("karma"),
    karmaParseConfig = require("karma/lib/config").parseConfig,
    jsonPackage = require("./package.json");

  var env = process.env.NODE_ENV || "development",
    jr = "components/scripts/js/dev/",
    jsCaptivateSources = [jr + "main.js", jr + "**/!(*.storyline.js)"],
    /*jr + "classes/callback.js",
                     jr + "managers/variables/generalVariableManager.captivate.js",
                     jr + "managers/variables/localStorageVariableManager.js",
                     jr + "managers/data/generalDataManager.js",
                     jr + "managers/slide/generalSlideManager.js",
                     jr + "managers/slideObjects/generalSlideObjectManager.js",
                     jr + "managers/behaviour/textBoxBehaviourManager.js",
                     jr + "classes/variableChangeMonitor.js"],*/
    jsStorylineSources = [jr + "main.js", jr + "**/!(*.captivate.js)"],
    sr = "components/swf/",
    swfSources = [sr + "bin/captivateextra.swf"],
    versionJSONSource = "components/scripts/json/version.json",
    versionJSONDestination = "builds/development/wdgt_source/swf",
    captivateExtraDevRoot = "builds/development",
    captivateExtraDevLocation = "builds/development/wdgt_source/html5/scripts",
    captivateExtraDevFileName = "captivate_extra.js",
    headlessCaptivateBaseFileName = "Infosemantics_CpExtra",
    ctr = "tests/output/captivate/",
    cbtr = "tests/output/_BETA_TESTS/captivate/",
    uir = "tests/output/_USER_ISSUES/",
    storylineExtraDevLocation = "builds/development/storyline_extra_web_object",
    storylineExtraDevFileName = "storyline_extra.js",
    karmaConfig = "karma.conf.js";

  var buildNumber = jsonPackage.buildNumber,
    versionNumber = jsonPackage.version;

  //////////////////////////////////////
  ///////// KARMA
  //////////////////////////////////////
  // function getCopywriteNotice() {
  //   return (
  //     "/**\n" +
  //     " * Captivate Extra\n" +
  //     " * Version: " +
  //     versionNumber +
  //     "\n" +
  //     " * Build: " +
  //     buildNumber +
  //     "\n" +
  //     " * Written By: Tristan Ward\n" +
  //     " * Company: Infosemantics\n" +
  //     " * Licence: See licence document provided with CpExtra purchase\n" +
  //     " * Copyright: Tristan Ward 2020\n" +
  //     " * " +
  //     getNoSleepCopywriteNotice() +
  //     "\n" +
  //     " */\n"
  //   );
  // }

  // function getNoSleepCopywriteNotice() {
  //   return `
 // *	COPYRIGHT NOTICE FOR THE NO-SLEEP JAVASCRIPT LIBRARY
 // *
 // *	The MIT License (MIT)
 // *	
 // *	Copyright (c) Rich Tibbett
 // *	
 // *	Permission is hereby granted, free of charge, to any person obtaining
 // *	a copy of this software and associated documentation files (the
 // *		"Software"), to deal in the Software without restriction, including
 // *	without limitation the rights to use, copy, modify, merge, publish,
 // *		distribute, sublicense, and/or sell copies of the Software, and to
 // *	permit persons to whom the Software is furnished to do so, subject to
 // *	the following conditions:
 // *	
 // *	The above copyright notice and this permission notice shall be
 // *	included in all copies or substantial portions of the Software.
 // *		
 // *		THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 // *	EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 // *	MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 // *	NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 // *	LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 // *	OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 // *	WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.`;
  // }

  //////////////////////////////////////
  ///////// KARMA
  //////////////////////////////////////
  // function runKarma(configFilePath, options, cb) {
  //   configFilePath = path.resolve(configFilePath);

  //   var log = gutil.log,
  //     colours = gutil.colors,
  //     config = karmaParseConfig(configFilePath, {}),
  //     server;

  //   Object.keys(options).forEach(function(key) {
  //     config[key] = options[key];
  //   });

  //   server = new karma.Server(config, function(exitCode) {
  //     log("Karma has exited with " + colours.red(exitCode));
  //     cb();
  //     process.exit(exitCode);
  //   });
  //   server.start();
  // }

  // gulp.task("test", function(cb) {
  //   runKarma(
  //     karmaConfig,
  //     {
  //       autoWatch: false,
  //       singleRun: true
  //     },
  //     cb
  //   );
  // });

  // gulp.task("test-dev", function(cb) {
  //   runKarma(
  //     karmaConfig,
  //     {
  //       autoWatch: true,
  //       singleRun: false
  //     },
  //     cb
  //   );
  // });

  //////////////////////////////////////
  ///////// TASKS
  //////////////////////////////////////

  // function iterateBuildNumber() {
  //   buildNumber += 1;

  //   gulp
  //     .src("./package.json")
  //     .pipe(
  //       gjsoneditor({
  //         buildNumber: buildNumber
  //       })
  //     )
  //     .pipe(gulp.dest("./"));

  //   return buildNumber;
  // }

  // function concatFiles(glob, fileName, destination) {
  //   return gulp
  //     .src(glob)
  //     .pipe(gconcat(fileName))
  //     .pipe(greplace("$$VERSION_NUMBER$$", jsonPackage.version))
  //     .pipe(greplace("$$BUILD_NUMBER$$", buildNumber))
  //     .pipe(uglify())
  //     .pipe(gulp.dest(destination));
  // }

  // gulp.task("iterateBuildNumber", function() {
  //   gutil.log("Build Number: " + iterateBuildNumber());
  // });

  // gulp.task("compileCaptivateJS", function() {
  //   return concatFiles(
  //     jsCaptivateSources,
  //     captivateExtraDevFileName,
  //     captivateExtraDevLocation
  //   );
  // });

  // gulp.task("compileStorylineJS", function() {
  //   return concatFiles(
  //     jsStorylineSources,
  //     storylineExtraDevFileName,
  //     storylineExtraDevLocation
  //   );
  // });

  // gulp.task("moveVersionJSON", function() {
  //   return gulp
  //     .src(versionJSONSource)
  //     .pipe(greplace("$$VERSION_NUMBER$$", jsonPackage.version))
  //     .pipe(greplace("$$BUILD_NUMBER$$", buildNumber))
  //     .pipe(gulp.dest(versionJSONDestination));
  // });

  // gulp.task("moveSWFOutput", ["moveVersionJSON"], function() {
  //   return gulp
  //     .src(swfSources)
  //     .pipe(gulp.dest("builds/development/wdgt_source/swf"));
  // });

  // gulp.task("compileWidgetDescription", function() {
  //   return gulp
  //     .src("components/scripts/xml/description.xml")
  //     .pipe(greplace("$$VERSION_NUMBER$$", jsonPackage.version))
  //     .pipe(gulp.dest("builds/development/wdgt_source"));
  // });

  // gulp.task("copyEffects", function() {
  //   return gulp
  //     .src("components/scripts/xml/Effects/**")
  //     .pipe(greplace("$$VERSION_NUMBER$$", jsonPackage.version))
  //     .pipe(greplace("$$BUILD_NUMBER$$", buildNumber))
  //     .pipe(gulp.dest("builds/development/Effects"));
  // });

  // gulp.task("compileWidget", ["compileWidgetDescription"], function() {
  //   return gulp
  //     .src("builds/development/wdgt_source/**")
  //     .pipe(gzip("Infosemantics_CpExtra.wdgt"))
  //     .pipe(gulp.dest("builds/development"));
  // });

  // gulp.task("moveFilesToProduction", function() {
  //   // Effects
  //   gulp
  //     .src("builds/development/Effects/**")
  //     .pipe(gulp.dest("builds/production/Effects"));

  //   // Widget Zip
  //   return gulp
  //     .src("builds/development/wdgt_source/**")
  //     .pipe(gulp.dest("builds/production/wdgt_source"));
  // });

  // gulp.task("uglifyProductionCode", function() {
  //   return gulp
  //     .src("builds/development/wdgt_source/html5/scripts/captivate_extra.js")
  //     .pipe(uglify())
  //     .pipe(gulp.dest("builds/production/wdgt_source/html5/scripts"));
  // });

  // gulp.task(
  //   "compileWidgetForProduction",
  //   [
  //     "compileWidgetDescription",
  //     "copyEffects",
  //     "moveFilesToProduction",
  //     "uglifyProductionCode"
  //   ],
  //   function() {
  //     gulp
  //       .src("builds/production/wdgt_source/**")
  //       .pipe(gzip("Infosemantics_CpExtra.wdgt"))
  //       .pipe(gulp.dest("builds/production"));

  //     return gulp
  //       .src("builds/production/wdgt_source/html5/scripts/captivate_extra.js")
  //       .pipe(
  //         grename({
  //           basename: "Infosemantics_CpExtra"
  //         })
  //       )
  //       .pipe(ginsert.prepend(getCopywriteNotice()))
  //       .pipe(gulp.dest("builds/production"));
  //   }
  // );

  //////////////////////////////////////
  ///////// UPDATING TEST FILES
  //////////////////////////////////////

  //function updateOnGlob(glob, devFile) {
  //  function getDirectoryPath(path) {
  //    var lastSlash = path.lastIndexOf("/");
  //    return path.substring(0, lastSlash);
  //  }

  //  function getFileName(path) {
  //    var lastSlash = path.lastIndexOf("/");
  //    var lastDot = path.lastIndexOf(".");
  //    return path.substring(lastSlash + 1, lastDot);
  //  }

  //  var stream, filePath, directoryPath, fileName;

  //  // Get list of files matching glob
  //  gglob(glob, {}, function(er, files) {
  //    // Loop through file list
  //    for (var i = 0; i < files.length; i += 1) {
  //      filePath = files[i];
  //      fileName = getFileName(filePath);
  //      directoryPath = getDirectoryPath(filePath);

  //      // DEBUGGING: Trace list of files
  //      //gutil.log(directoryPath);

  //      // Rename the javascript file to either the widget or the headless name
  //      stream = gulp
  //        .src(devFile)
  //        .pipe(
  //          grename({
  //            basename: fileName
  //          })
  //        )
  //        // Save the new version over the currently located CpExtra instance
  //        .pipe(gulp.dest(directoryPath))
  //        .pipe(gconnect.reload());
  //    }
  //  });

  //  return stream;
  //}

  // gulp.task("moveCaptivateJSToDevRoot", function() {
  //   return gulp
  //     .src(captivateExtraDevLocation + "/" + captivateExtraDevFileName)
  //     .pipe(
  //       grename({
  //         basename: headlessCaptivateBaseFileName
  //       })
  //     )
  //     .pipe(gulp.dest(captivateExtraDevRoot));
  // });

  // gulp.task(
  //   "updateCaptivateTests",
  //   ["compileCaptivateJS", "moveCaptivateJSToDevRoot"],
  //   function() {
  //     return updateOnGlob(
  //       "tests/output/**/@(captivate_extra.js|Infosemantics_CpExtra.js)",
  //       captivateExtraDevLocation + "/" + captivateExtraDevFileName
  //     );
  //   }
  // );

  // gulp.task("updateStorylineTests", ["compileStorylineJS"], function() {
  //   return updateOnGlob(
  //     "tests/output/**/storyline_extra.js",
  //     storylineExtraDevLocation + "/" + storylineExtraDevFileName
  //   );
  // });

  ///// WATCHES
  // TO CANCEL A TASK RUNNING ON THE COMMAND LINE, HIT: Ctrl + c
  gulp.task("watch", function() {
    return gulp.watch(
      ["components/scripts/js/**/*.js"],
      ["iterateBuildNumber", "updateCaptivateTests", "updateStorylineTests"]
    );
  });

  ////// SERVER
  gulp.task("connect", function() {
    return gconnect.server({
      root: "tests/output",
      livereload: true
    });
  });

  ////////// DEFAULT
  gulp.task("default", [
    "updateCaptivateTests",
    "updateStorylineTests",
    "moveVersionJSON",
    "compileWidget",
    "connect",
    "watch"
  ]); //,"test-dev"]);
})();