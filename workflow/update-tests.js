const gglob = require("glob"),
    grename = require("gulp-rename"),
    gulp = require("gulp"),
    log = require("fancy-log"),
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

			console.log("Updating: " + fileDirectory);

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

//function updateOnGlob(glob, devFile) {

//  var stream, filePath, directoryPath, fileName;

//  // Get list of files matching glob
//  gglob(glob, {}, function(er, files) {
//    // Loop through file list
//    for (var i = 0; i < files.length; i += 1) {
//      filePath = files[i];
//      fileName = getFileName(filePath);
//      directoryPath = getDirectoryPath(filePath);

//      // DEBUGGING: Trace list of files
//      //gutil.log(directoryPath);

//      // Rename the javascript file to either the widget or the headless name
//      stream = gulp
//        .src(devFile)
//        .pipe(
//          grename({
//            basename: fileName
//          })
//        )
//        // Save the new version over the currently located CpExtra instance
//        .pipe(gulp.dest(directoryPath))
//        .pipe(gconnect.reload());
//    }
//  });

//  return stream;
//}
