
  function concatFiles(glob, fileName, destination) {
    return gulp
      .src(glob)
      .pipe(gconcat(fileName))
      .pipe(greplace("$$VERSION_NUMBER$$", jsonPackage.version))
      .pipe(greplace("$$BUILD_NUMBER$$", buildNumber))
      .pipe(uglify())
      .pipe(gulp.dest(destination));
  }
