/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 10:29 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.timekeeper", function () {

    "use strict";

    var module = unitTests.getModule("timekeeper"),
        gotoAndLoop,
        slideStartFrame;

    function createWatchData (data) {

        if (!data) {
            data = {};
        }

        if (!data.startFrame) {
            data.startFrame = 1;
        }

        if (!data.endFrame) {
            data.endFrame = 10;
        }

        if (!data.enter) {
            data.enter = jasmine.createSpy("enter");
        }

        if (!data.exit) {
            data.exit = jasmine.createSpy("exit");
        }

        if (!data.isSlideBased) {
            data.isSlideBased = false;
        }

        if (!data.slideNumber) {
            data.slideNumber = 1;
        }

        return data;
    }

    beforeEach(function () {

        var slideStartFrames = {};

        slideStartFrame = function (slide, frame) {
            slideStartFrames[slide] = frame;
        };

        window._extra = {
            "classes":unitTests.classes,
            "eventManager": {
                "eventDispatcher": new unitTests.classes.EventDispatcher()
            },
            "movieStatus":{
                "currentFrame":0
            },
            "slideManager":{
                "currentSlideNumber": 0,
                "getSlideData": function (slide) {

                    if (slideStartFrames[slide]) {
                        return {
                            "startFrame":slideStartFrames[slide]
                        };
                    }
                    return {};

                }
            },
            "w":window,
            "error": jasmine.createSpy("_extra.error")
        };

        spyOn(_extra.eventManager.eventDispatcher, "addEventListener").and.callThrough();
        spyOn(_extra.eventManager.eventDispatcher, "removeEventListener").and.callThrough();

        gotoAndLoop = function (frame, slide) {

            if (!slide) {
                slide = 1;
            }

            _extra.movieStatus.currentFrame = frame;
            _extra.slideManager.currentSlideNumber = slide;

            _extra.eventManager.eventDispatcher.dispatchEvent({
                "type":"newframe"
            });
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.timekeeper", function () {
        expect(_extra.timekeeper).toBeDefined();
    });

    it("should use timekeeper.conformsToInterface() to validate timekeeper interface", function () {

        var f = function () {};

        expect(_extra.timekeeper.conformsToInterface({
            "startFrame":0,
            "endFrame":10,
            "enter":f,
            "exit":f,
            "isSlideBased": true,
            "slideNumber":1
        })).toBe(true);

    });

    it("should inform us if the movie enters our selected region", function () {

        // ---- Setup
        var watchData = createWatchData({
            "startFrame":5,
            "endFrame":10
        });

        _extra.timekeeper.addWatch(watchData);

        // ---- Test 1
        gotoAndLoop(4);
        expect(watchData.enter).not.toHaveBeenCalled();

        // ---- Test 2
        gotoAndLoop(5);
        expect(watchData.enter).toHaveBeenCalled();
        expect(watchData.exit).not.toHaveBeenCalled();

        // ---- Test 3
        gotoAndLoop(11);
        expect(watchData.exit).toHaveBeenCalled();
    });

    it("should inform us when entering certain frame of slide", function () {

        // ---- Setup
        var watchData = createWatchData({
            "isSlideBased": true,
            "slideNumber": 2,
            "startFrame":5,
            "endFrame":10
        });

        _extra.timekeeper.addWatch(watchData);

        // The start frame for slide 2 is frame 10
        slideStartFrame(2, 10);

        // ---- Test 1
        gotoAndLoop(5, 1); // Although the frame number is right, the slide number is not
        expect(watchData.enter).not.toHaveBeenCalled();
        expect(watchData.exit).not.toHaveBeenCalled();

        // ---- Test 2
        gotoAndLoop(5, 2); // Although the slide number is right, the frame number is not
        expect(watchData.enter).not.toHaveBeenCalled();
        expect(watchData.exit).not.toHaveBeenCalled();

        // ---- Test 3
        gotoAndLoop(15, 2);
        expect(watchData.enter).toHaveBeenCalled();
        expect(watchData.exit).not.toHaveBeenCalled();

        // ---- Test 4
        gotoAndLoop(21, 2);
        expect(watchData.exit).toHaveBeenCalled();

    });

    it("should allow us to remove watchers", function () {

        // ---- Setup
        var watchData = createWatchData({
            "startFrame":5,
            "endFrame":10
        });

        _extra.timekeeper.addWatch(watchData);

        // ---- Test 1
        gotoAndLoop(5);
        expect(watchData.enter).toHaveBeenCalled();
        expect(watchData.exit).not.toHaveBeenCalled();

        _extra.timekeeper.removeWatch(watchData);

        gotoAndLoop(11);
        expect(watchData.exit).not.toHaveBeenCalled();

    });

    it("should only listen to the 'newframe' event when something needs to be tracked", function () {

        var projectWatcher = createWatchData(),
            slideWatcher = createWatchData({
                "isSlideBased": true,
                "slideNumber": 2
            });

        function hasListener () {
            expect(_extra.eventManager.eventDispatcher.hasListenerFor("newframe")).toBe(true);
        }

        function doesNotHaveListener () {
            expect(_extra.eventManager.eventDispatcher.hasListenerFor("newframe")).toBe(false);
        }


        // ---- Test 1
        doesNotHaveListener();

        // ---- Test 2
        _extra.timekeeper.addWatch(projectWatcher);
        hasListener();
        _extra.timekeeper.removeWatch(projectWatcher);
        doesNotHaveListener();

        // ---- Test 3
        _extra.timekeeper.addWatch(slideWatcher);
        hasListener();
        _extra.timekeeper.removeWatch(slideWatcher);
        doesNotHaveListener();

        // ---- Test 4
        _extra.timekeeper.addWatch(projectWatcher);
        _extra.timekeeper.addWatch(slideWatcher);
        hasListener();
        _extra.timekeeper.removeWatch(projectWatcher);
        hasListener();
        _extra.timekeeper.removeWatch(slideWatcher);
        doesNotHaveListener();

    });
});
