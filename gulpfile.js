const { series } = require("gulp"),
    { log } = require("gulp-util"),
    compile = require("./workflow/compile"),
    version = require("./workflow/version"),
    sources = require("./workflow/sources");
(karmaServer = require("./workflow/karma-server")),
    (generateCopyright = require("./workflow/copyright-notice.js").generate);

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
function compileAndStoreInDevBuilds(done) {
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

exports.test = copyCompiledCpExtraIntoWidgetFolder;
exports.compileJSOutput = series(
    incrementBuildNumber,
    compileAndStoreInDevBuilds,
    copyCompiledCpExtraIntoWidgetFolder
);
// exports.test = (done) => {

//     log(generateCopyright())

//     done();
// }
// exports.default = series(test, test2)
