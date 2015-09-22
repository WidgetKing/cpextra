/*global require*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 22/09/15
 * Time: 11:54 AM
 * To change this template use File | Settings | File Templates.
 */
(function () {

    "use strict";

    var gulp = require("gulp"),
        gutil = require("gulp-util");

    gulp.task("log", function () {
        gutil.log("Our workflow is up and running!");
    });

}());

