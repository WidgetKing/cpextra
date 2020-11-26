const gulp = require("gulp"),
    reporters = require("jasmine-reporters"),
    unitTestsGlob = require("./sources.js"),
    Jasmine = require("jasmine");

// Config file
const config = {
    spec_dir: "components/scripts/js",
    // Helpers are executed before specs
    helpers: [
        "tests/testSetup.js",
        // "dev/main.js",
        "dev/**/!(*.storyline.js)",
        "tests/testsTeardown.js"
    ],

    spec_files: [
        "tests/**/*.js"
        // "tests/main.test.js"
    ]
};

exports.run = function(done) {
    const jasmine = new Jasmine();
    jasmine.loadConfig(config);
    jasmine.configureDefaultReporter(new reporters.TerminalReporter());
    jasmine.onComplete(done);
    jasmine.execute();
};
