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
        headlessCaptivateTestSources = [ctr + "15_Headless_Regular/assets/libraries", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\captivate\15_Headless_Regular\assets\libraries
                                        ctr + "18_AudioLoop/assets/libraries", //D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\captivate\18_AudioLoop\assets\libraries
                                        uir + "XCMND_SOP-1/assets/libraries", // _USER_ISSUES\XCMND_SOP-1\assets\libraries
                                        uir + "PositionTest/assets/libraries", // _USER_ISSUES\XCMND_SOP-1\assets\libraries
                                        uir + "Spectrav9/assets/libraries" //D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\Spectrav9\assets\libraries
        ],
        captivateTestSources = [ctr + "01_CE_Local_Storage_Variables/wr/w_5569/scripts",
                               ctr + "02_CE_Local_Storage_Variables_2/wr/w_5235/scripts",
                               ctr + "02_CE_Local_Storage_Variables_2/wr/w_5495/scripts",
                               ctr + "03_CE_TextEntryBox_Behaviour_Changes/wr/w_5235/scripts",
                               ctr + "05_CE_SlideTests/wr/w_5235/scripts",
                               ctr + "06_CE_Command_Variables/wr/w_6525/scripts",
                               ctr + "07_CE_Slide_Object_State_Tests/wr/w_5235/scripts",
                               ctr + "08_CE_Typed_Variables/wr/w_5235/scripts",
                               ctr + "09_CE_Get_Variables/wr/w_5235/scripts",
                               ctr + "10_CE_Advanced_Actions/wr/w_5235/scripts",
                               ctr + "11_CE_SlideObjectProperties/wr/w_5235/scripts",
                               ctr + "12_CE_EventListener/wr/w_5235/scripts",
                               ctr + "13_CE_AllObjects/wr/w_5259/scripts",
                               ctr + "14_CE_DragAndDrop/wr/w_5270/scripts",
                               ctr + "16_CE_TimingDifferences/wr/w_5270/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\captivate\16_CE_TimingDifferences\wr\w_5270\scripts
                               uir + "00_home_menu/wr/w_15552/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\00_home_menu\wr\w_15552\scripts
                               uir + "01_module_1/wr/w_15320/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\01_module_1\wr\w_15320\scripts
                               uir + "03_module_3/wr/w_17057/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\03_module_3\wr
                               uir + "04_cpextra_event_listeners/wr/w_5296/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\04_cpextra_event_listeners\wr\w_5296
                               uir + "click_box_cursor/wr/w_15365/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\click_box_cursor\wr\w_15365
                               uir + "Autostate4/wr/w_2524/scripts",
                               uir + "cp_extra_bug_example/wr/w_8282/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\cp_extra_bug_example\wr\w_8282\scripts
                               uir + "rollover_rollout/wr/w_15157/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\rollover_rollout\wr\w_15157
                               uir + "CPCONFIG_TEB-1/wr/w_5352/scripts",
                               uir + "gabriel_test_cp_extra_and_zoom/wr/w_5585/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\gabriel_test_cp_extra_and_zoom\wr\w_5585\scripts
                               uir + "button_rollout/wr/w_5270/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\button_rollout\wr\w_5270\scripts
                               uir + "VideoEnded/wr/w_5414/scripts", //VideoEnded\wr\w_5414\scripts
                               uir + "PERSISTVARS-1/wr/w_5442/scripts",
                               uir + "test/wr/w_6660/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\test\wr\w_6660\scripts
                               uir + "xcmnd_evt-2-v2/wr/w_5306/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\xcmnd_evt-2-v2\wr\w_5306\scripts
                               uir + "XCMND_SOP-2/wr/w_2410/scripts",
                               uir + "PREFERENCES-1/wr/w_5247/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\PREFERENCES-1\wr\w_5247
                               uir + "XCMND_SOP-1/wr/w_5258/scripts",
                               uir + "KC/cpextra_test_responsive_persistvars_4049/wr/w_5750/scripts",
                               uir + "KC/XCMND_SOP-2/wr/w_5282/scripts",
                               uir + "teb_preferences/wr/w_15141/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\teb_preferences\wr\w_15141\scripts
                               uir + "local_vs_session/wr/w_15211/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\local_vs_session\wr\w_15211\scripts
                               uir + "XCMND_SOP-1B/wr/w_5850/scripts",
                               uir + "persistvars1-1thru1-3/wr/w_5664/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\persistvars1-1thru1-3\wr\w_5664\scripts
                               uir + "KC/xcmnd_ca-1_1 through1_4test/wr/w_5768/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_USER_ISSUES\KC\xcmnd_ca-1_1 through1_4test\wr\w_5768\scripts
                               cbtr + "01_COMMAND_VARIABLES/XCMND_AA/XCMND_AA-1/wr/w_5259/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_SOP/XCMND_SOP-1/wr/w_6020/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_SOP/XCMND_SOP-1-captions/wr/w_5259/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_SOP/XCMND_SOP-2/wr/w_5259/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_SOP/XCMND_SOP-3/wr/w_5259/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_CA/XCMND_CA-1/wr/w_5261/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_CA/XCMND_CA-2/wr/w_5261/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_CA/XCMND_CA-3/wr/w_5247/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_MR/XCMND_MR-1/wr/w_5980/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_MR/XCMND_MR-2/wr/w_5268/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_EVT/XCMND_EVT-1/wr/w_5259/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_EVT/XCMND_EVT-2/wr/w_5820/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_EVT/XCMND_EVT-3/wr/w_5820/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_EVT/XCMND_EVT-4/wr/w_5259/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_EVT/XCMND_EVT-5/wr/w_5259/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_EVT/XCMND_EVT-6/wr/w_15157/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_BETA_TESTS\captivate\01_COMMAND_VARIABLES\XCMND_EVT\XCMND_EVT-6\wr\w_15157
                               cbtr + "01_COMMAND_VARIABLES/XCMND_EVT/XCMND_EVT-7/wr/w_5270/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_BETA_TESTS\captivate\01_COMMAND_VARIABLES\XCMND_EVT\XCMND_EVT-7\wr\w_5270
                               cbtr + "01_COMMAND_VARIABLES/XCMND_MISC/XCMND_MISC-1/wr/w_5247/scripts",
                               cbtr + "01_COMMAND_VARIABLES/XCMND_MISC/XCMND_MISC-2/wr/w_5270/scripts",
                               cbtr + "02_PERSISTVARS/PERSISTVARS-1/wr/w_5259/scripts",
                               cbtr + "02_PERSISTVARS/PERSISTVARS-2/wr/w_5247/scripts",
                               cbtr + "02_PERSISTVARS/PERSISTVARS-2-NonResponsive/wr/w_5259/scripts",
                               cbtr + "03_AUTOMATED_STATE_MANAGEMENT/AUTOSTATE-1/wr/w_5247/scripts",
                               cbtr + "03_AUTOMATED_STATE_MANAGEMENT/AUTOSTATE-2/wr/w_5247/scripts",
                               cbtr + "03_AUTOMATED_STATE_MANAGEMENT/AUTOSTATE-3/wr/w_5247/scripts",
                               cbtr + "03_AUTOMATED_STATE_MANAGEMENT/AUTOSTATE-4/wr/w_5537/scripts",
                               cbtr + "03_AUTOMATED_STATE_MANAGEMENT/AUTOSTATE-7/wr/w_5247/scripts",
                               cbtr + "03_AUTOMATED_STATE_MANAGEMENT/AUTOSTATE-9/wr/w_5247/scripts",
                               cbtr + "04_CAPTIVATE_CONFIG/CPCONFIG_QUIZ/QUIZCONFIG-1/wr/w_5270/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_BETA_TESTS\captivate\04_CAPTIVATE_CONFIG\CPCONFIG_QUIZ\QUIZCONFIG-1\wr\w_5247
                               cbtr + "04_CAPTIVATE_CONFIG/CPCONFIG_QUIZ/QUIZCONFIG-1-normal/wr/w_5533/scripts", //
                               cbtr + "04_CAPTIVATE_CONFIG/CPCONFIG_PLAYBAR/CPCONFIG_PLAYBAR-1/wr/w_5259/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_BETA_TESTS\captivate\04_TEXT_ENTRY_BOX_BEHAVIOUR\TEB-1\wr\w_5247\scripts
                               cbtr + "04_CAPTIVATE_CONFIG/CPCONFIG_TEB/CPCONFIG_TEB-1/wr/w_5247/scripts",
                               cbtr + "04_CAPTIVATE_CONFIG/CPCONFIG_TEB/CPCONFIG_TEB-2/wr/w_5247/scripts",
                               cbtr + "04_CAPTIVATE_CONFIG/CPCONFIG_MISC/CPCONFIG_MISC_1/wr/w_5270/scripts", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_BETA_TESTS\captivate\04_CAPTIVATE_CONFIG\CPCONFIG_MISC\CPCONFIG_MISC_1\wr\w_5270\scripts
                               cbtr + "07_INFO/INFO_MISC-1/wr/w_5247/scripts",
                               cbtr + "07_INFO/INFO_MISC-2/wr/w_5270/scripts",
                               cbtr + "08_DOC_SETUP/DOC_SETUP-1/wr/w_5279/scripts",
                               cbtr + "08_DOC_SETUP/DOC_SETUP-2/wr/w_5279/scripts"],

        storylineExtraDevLocation = "builds/development/storyline_extra_web_object",
        storylineExtraDevFileName = "storyline_extra.js",
        str = "tests/output/storyline/",
        sbtr = "tests/output/_BETA_TESTS/storyline/",
        storylineTestSources = [str + "01_CE_Local_Storage_Variables_1 - Storyline output/story_content/WebObjects/6O4Z2639lm4",
                                str + "01_CE_Local_Storage_Variables_2 - Storyline output/story_content/WebObjects/64qP4KPGj6t",
                                str + "02_SE_Slide_Tests - Storyline output/story_content/WebObjects/6pcKh8TGeK4",
                                sbtr + "02_PERSISTVARS/PERSISTVARS_1 - Storyline output/story_content/WebObjects/6IntEoqvMLh", // D:\01_PROJECTS\02_Infosemantics\00_CaptivateExtra\_dev\tests\output\_BETA_TESTS\storyline\02_PERSISTVARS\PERSISTVARS_1 - Storyline output\story_content\WebObjects\6IntEoqvMLh
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

    function replaceJSFileAtDestinations(jsFile, destinations, name) {
        var piper = gulp.src(jsFile);
        var result;

        for (var i = 0; i < destinations.length; i+=1) {

            gutil.log("Copying Extra to: " + destinations[i]);
            if (name) {
                piper = piper.pipe(grename({
                    basename: name
                }));
            }
            result = piper.pipe(gulp.dest(destinations[i]));

        }

        return result;
    }

    gulp.task("updateCaptivateTests", ["compileCaptivateJS"], function () {

        replaceJSFileAtDestinations(captivateExtraDevLocation + "/" + captivateExtraDevFileName, headlessCaptivateTestSources, headlessCaptivateBaseFileName);

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
    gulp.task("default",["updateCaptivateTests","updateStorylineTests","moveVersionJSON","compileWidget","connect","watch","test-dev"]);

}());

