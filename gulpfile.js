const { parallel, watch, series } = require("gulp"),
    compile = require("./workflow/compile"),
    version = require("./workflow/version"),
    sources = require("./workflow/sources"),
    server = require("./workflow/server"),
    karma = require("./workflow/karma"),
    updateTests = require("./workflow/update-tests"),
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

function zipWidgetAndPlaceInProduction(done) {
    compile.zipFolder(
        sources.devWidgetFolderGlob,
        sources.productionOutputDirectory,
        sources.widgetFileName,
        done
    );
}

function copyEffectsIntoProduction(done) {
    compile.copy(
        sources.effectsSourceFolderGlob,
        sources.productionEffectsOutputDirectory,
        done
    );
}

function updateAllTests(done) {
    updateTests.updateGlob(
        sources.testsCpExtraGlob,
        sources.devOutputCompiledCpExtra,
        done
    );
}

exports.compileJSOutput = series(
    incrementBuildNumber,
    compileJSModulesAndStoreInDevBuilds,
    copyCompiledCpExtraIntoWidgetFolder
);

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
    copyDevJSToProduction,
    copyEffectsIntoProduction
);

function watchModulesCompileAndUpdateTests() {
    watch(
        sources.cpExtraModulesForCaptivate,
        {
            ignoreInitial: false
        },
        function(done) {
            // Executes when files are changes
            exports.compileJSOutput(() => updateAllTests(done));
        }
    );
}


exports.runUnitTests = karma.run(__dirname, true);
exports.runUnitTestsContinually = karma.run(__dirname);

exports.piMode = done => {
	server.start(done);
	watch(sources.cpExtraModulesForCaptivate, exports.compileJSOutput);
	watch(sources.devOutputCompiledCpExtra, updateAllTests);

	watch(sources.testDirectory).on("change", server.reload);
}

exports.default = parallel(exports.runUnitTestsContinually, exports.piMode);
