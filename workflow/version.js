const { inc } = require("ramda"),
    { log } = require("gulp-util"),
    gjsoneditor = require("gulp-json-editor"),
    packageJSON = require("../package.json"),
    greplace = require("gulp-replace"),
    versionNumber = packageJSON.version,
    gulp = require("gulp");

var buildNumber = packageJSON.buildNumber;

exports.getCurrentVersion = () => versionNumber;
exports.getCurrentBuild = () => buildNumber;

exports.incrementBuildNumber = () => {
    buildNumber += 1;

    gulp.src("./package.json")
        .pipe(
            gjsoneditor({
                buildNumber: buildNumber
            })
        )
        .pipe(gulp.dest("./"));

    log(`New build: ${buildNumber}`);

    return buildNumber;
};

exports.replaceBuildPlaceholder = () => {
    return greplace("$$BUILD_NUMBER$$", buildNumber);
}
exports.replaceVersionPlaceholder = () => {
    return greplace("$$VERSION_NUMBER$$", versionNumber);
};
