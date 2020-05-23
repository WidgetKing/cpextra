const { replaceBuildAndVersionNumberPlaceholders } = require("./version.js"),
    gulp = require("gulp"),
    gzip = require("gulp-zip"),
    grename = require("gulp-rename"),
    { log } = require("gulp-util"),
    gconcat = require("gulp-concat"),
    version = require("./version");
uglify = require("gulp-uglify");

exports.globIntoFile = (glob, fileName, destination, done) => {
    return (
        gulp
            .src(glob)
            // .pipe(tap(() => log("in pipe")))
            .pipe(gconcat(fileName))
            .pipe(version.replaceBuildPlaceholder())
            .pipe(version.replaceVersionPlaceholder())
            .pipe(uglify())
            .pipe(gulp.dest(destination))
            .on("end", done)
    );
};

exports.copy = (file, destination, done) => {
    return gulp
        .src(file)
        .pipe(gulp.dest(destination))
        .on("end", done);
};
exports.copyAndReplaceVersionPlaceholders = (file, destination, done) => {
    return gulp
        .src(file)
        .pipe(version.replaceBuildPlaceholder())
        .pipe(version.replaceVersionPlaceholder())
        .pipe(gulp.dest(destination))
        .on("end", done);
};

exports.copyAndRename = (file, destination, newName, done) => {
    return gulp
        .src(file)
        .pipe(
            grename({
                basename: newName
            })
        )
        .pipe(gulp.dest(destination))
        .on("end", done);
};
exports.zipFolder = (globToZip, destination, zipName, done) => {
return gulp
        .src(globToZip)
        .pipe(gzip(zipName))
        .pipe(gulp.dest(destination))
        .on("end", done);
}
