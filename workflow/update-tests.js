const gglob = require("glob"),
    grename = require("gulp-rename"),
    gulp = require("gulp"),
    { forEach, pipe } = require("ramda");

function getFileName(path) {
    var lastSlash = path.lastIndexOf("/");
    var lastDot = path.lastIndexOf(".");
    return path.substring(lastSlash + 1, lastDot);
}

function getFileDirectory(path) {
    var lastSlash = path.lastIndexOf("/");
    return path.substring(0, lastSlash);
}

exports.updateGlob = (glob, newFile, done) => {
    
    // Convert glob to an array of file paths
    gglob(glob, {}, (er, files) => {

        // Will save the last stream so we can listen for its completion.
        var stream;

        forEach(filePath => {
            // Extract file name from path
            const fileName = getFileName(filePath);

            // Extract directory from file path
            const fileDirectory = getFileDirectory(filePath);

			// Uncomment if you want to see each update directory listed individually
			// console.log("Updating: " + fileDirectory);

            stream = gulp
                .src(newFile)
                .pipe(
                    // Rename to whatever this file was called
                    grename({
                        basename: fileName
                    })
                )
                // Save the new version over the currently located CpExtra instance
                .pipe(gulp.dest(fileDirectory));
        }, files);

        // This is hte last stream. When it has been completed we will
        // signal that the action is complete.
        stream.on("end", done);
    });

};

