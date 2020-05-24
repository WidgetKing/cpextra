const gconnect = require("gulp-connect"),
    gulp = require("gulp"),
    sources = require("./sources.js");

exports.start = () => {
    return gconnect.server({
        root: sources.testDirectory,
        livereload: true
    });
};

exports.reload = done => {
    gulp.pipe(gconnect.reload()).on("end", done);
};
