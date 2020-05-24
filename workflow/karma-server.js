const { pipe, curry, __ } = require("ramda"),
    karmaServer = curry(require("karma").Server),
    log = require("fancy-log"),
    colors = require("ansi-colors"),
    pc = require("karma/lib/config").parseConfig,
    karmaParseConfig = curry(pc),
    configFile = __dirname + "/karma.conf.js";

const exit = curry(function(done, exitCode) {
    log("Karma has exited with " + colors.red(exitCode));
    done();
    process.exit(exitCode);
});

function run(initialConfig, done) {
    pipe(
        karmaParseConfig(configFile),
        karmaServer(__, exit(done))
    )(initialConfig);
}

/////// EXPORTS
exports.runSingleTest = done =>
    run({ singleRun: true, autoWatch: false }, done);

exports.runContinualTests = done =>
    run({ singleRun: false, autoWatch: true }, done);

/*
  function runKarma(configFilePath, options, cb) {
    configFilePath = path.resolve(configFilePath);

    var log = gutil.log,
      colours = gutil.colors,
      config = karmaParseConfig(configFilePath, {}),
      server;

    Object.keys(options).forEach(function(key) {
      config[key] = options[key];
    });

    server = new karma.Server(config, function(exitCode) {
      log("Karma has exited with " + colours.red(exitCode));
      cb();
      process.exit(exitCode);
    });
    server.start();
  }
  */
