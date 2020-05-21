const { series } = require("gulp"),
    { log } = require("gulp-util"),
    buildNumber = require("./workflow/build-number"),
    karmaServer = require("./workflow/karma-server"),
    generateCopyright = require("./workflow/copyright-notice.js").generate;


/////////
///////////////// UNIT TESTS
/////////////////////////////////
// exports.runContinualTests = karmaServer.runContinualTests;
// exports.runSingleTest = karmaServer.runSingleTest;

exports.test = (done) => {

    log(generateCopyright())

    done();
}
// exports.default = series(test, test2)
