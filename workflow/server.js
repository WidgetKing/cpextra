const rootDirectory = require("./sources").testDirectory,
  { src } = require("gulp"),
  { callWithCooldown } = require("./utils"),
  connect = require("gulp-connect");

console.log(rootDirectory);
exports.start = done => {
  connect.server(
    {
      root: rootDirectory,
      livereload: true,
      port: 8080
    },
    function() {
      this.server.on("close", done);
    }
  );
};

exports.reload = callWithCooldown(filepath => {
  console.log("RELOADING TEST SERVER");
  src(filepath, { read: false }).pipe(connect.reload());
});
