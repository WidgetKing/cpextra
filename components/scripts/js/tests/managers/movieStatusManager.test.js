/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/06/16
 * Time: 9:59 AM
 * To change this template use File | Settings | File Templates.
 */
fdescribe("A test suite for _extra.movieStatus", function () {

    "use strict";

    var module = unitTests.getModule("movieStatusManager", unitTests.CAPTIVATE);

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "captivate":{
                "movie":{
                    "paused":false
                }
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define the _extra.movieStatus object", function () {
        expect(_extra.movieStatus).toBeDefined();
    });

    it("should be able to tell us if the movie is currently playing or paused", function () {

        expect(_extra.movieStatus.isPlaying()).toBe(true);
        expect(_extra.movieStatus.isPaused()).toBe(false);

    });
});