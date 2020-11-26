const gulp = require("gulp"),
  Server = require("karma").Server;

exports.run = (directory, once = false) => done => {
	console.log(done);
  new Server(
    {
      configFile: directory + "\\karma.conf.js",
      singleRun: once
    }
    ,done
  ).start();
};
