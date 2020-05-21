const { series } = require("gulp"),
    gutil = require("gulp-util"),
    karmaServer = require("karma").Server;

function test(done) {
    new karmaServer ({
        configFile: __dirname + '/karma.conf.js',
        singleRun: true
    }, done).start();
}

function test2(cb) {
    gutil.log("Another trace")
    cb();
}

exports.test = test;
exports.default = series(test, test2)
