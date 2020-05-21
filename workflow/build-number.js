const { inc } = require("ramda"),
    gjsoneditor = require("gulp-json-editor"),
    packageJSON = require("../package.json"),
    versionNumber = packageJSON.version,
    gulp = require("gulp");

var buildNumber = packageJSON.buildNumber;

exports.getCurrentVersion = () => versionNumber;
exports.getCurrent = () => buildNumber;

exports.inc = () => {
    buildNumber += 1;

    gulp.src("./package.json")
        .pipe(
            gjsoneditor({
                buildNumber: buildNumber
            })
        )
        .pipe(gulp.dest("./"));

    return buildNumber;
};
