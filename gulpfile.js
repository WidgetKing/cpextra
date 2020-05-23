const { series } = require("gulp"),
    { log } = require("gulp-util"),
    compile = require("./workflow/compile"),
    version = require("./workflow/version"),
    sources = require("./workflow/sources"),
    karmaServer = require("./workflow/karma-server"),
    generateCopyright = require("./workflow/copyright-notice.js").generate;

/////////
///////////////// UNIT TESTS
/////////////////////////////////
// exports.runContinualTests = karmaServer.runContinualTests;
// exports.runSingleTest = karmaServer.runSingleTest;

/////////
///////////////// BUILD NUMBER
/////////////////////////////////
function incrementBuildNumber(done) {
    version.incrementBuildNumber();
    done();
}

/////////
///////////////// Compile
/////////////////////////////////
function compileJSModulesAndStoreInDevBuilds(done) {
    compile.globIntoFile(
        sources.cpExtraModulesForCaptivate,
        sources.compiledCpExtraFileName,
        sources.devOutputDirectory,
        done
    );
}

function copyCompiledCpExtraIntoWidgetFolder(done) {
    compile.copy(
        sources.devOutputCompiledCpExtra,
        sources.devOutputWidgetJSDirectory,
        done
    );
}

function copyDevJSToProduction(done) {
    compile.copy(
        sources.devOutputCompiledCpExtra,
        sources.productionOutputDirectory,
        done
    );
}

function copySWFIntoWidgetFolder(done) {
    compile.copyAndRename(
        sources.widgetPropertiesSWF,
        sources.devOutputWidgetSWFDirectory,
        sources.widgetPropertieSWFName,
        done
    );
}

function copySWFVersionJSON(done) {
    compile.copyAndReplaceVersionPlaceholders(
        sources.versionJSONFile,
        sources.devOutputWidgetSWFDirectory,
        done
    );
}

function copyWidgetDescriptionXML(done) {
    compile.copyAndReplaceVersionPlaceholders(
        sources.widgetDescriptionXML,
        sources.devOutputWidgetRoot,
        done
    );
}

exports.compileJSOutput = series(
    incrementBuildNumber,
    compileJSModulesAndStoreInDevBuilds,
    copyCompiledCpExtraIntoWidgetFolder
);

function zipWidgetAndPlaceInProduction(done) {
    compile.zipFolder(
        sources.devWidgetFolderGlob,
        sources.productionOutputDirectory,
        sources.widgetFileName,
        done
    );
}

exports.compileProductionWidget = series(
    exports.compileJSOutput,
    copyCompiledCpExtraIntoWidgetFolder,
    copySWFIntoWidgetFolder,
    copySWFVersionJSON,
    copyWidgetDescriptionXML,
    zipWidgetAndPlaceInProduction
);

exports.compileProductionEverything = series(
    exports.compileProductionWidget,
    copyDevJSToProduction
);

exports.test = copySWFIntoWidgetFolder;
// gulp.task("compileWidget", ["compileWidgetDescription"], function() {
//   return gulp
//     .src("builds/development/wdgt_source/**")
//     .pipe(gzip("Infosemantics_CpExtra.wdgt"))
//     .pipe(gulp.dest("builds/development"));
// });
// exports.test = (done) => {

//     log(generateCopyright())

//     done();
// }
// exports.default = series(test, test2)
