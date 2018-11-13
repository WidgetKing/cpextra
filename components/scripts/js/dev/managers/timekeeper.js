/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 10:22 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("timekeeper", ["movieStatusManager"], function () {

    "use strict";

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// INDIVIDUAL WATCHER MANAGERS
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    var createWatcherManager = function () {

            return (function () {

                var watchers = [];

                function checkWatcherForFrame (watcher, frame) {

                    if (watcher.inside) {

                        if (frame >= watcher.endFrame ||
                            frame <= watcher.startFrame) {

                            watcher.exit();
                            watcher.inside = false;

                        }

                    // We are not inside the frame range
                    } else {

                        if (frame >= watcher.startFrame &&
                            frame < watcher.endFrame) {

                            watcher.enter();
                            watcher.inside = true;

                        }

                    }

                }

                return {
                    "add": function (watcher) {

                        watchers.push(watcher);

                    },
                    "remove": function (watcher) {

                        watchers.splice(watchers.indexOf(watcher), 1);

                    },
                    "loop": function (frame) {

                        for (var i = 0; i < watchers.length; i += 1) {

                            checkWatcherForFrame(watchers[i], frame);

                        }

                    },
                    "isEmpty": function () {
                        return watchers.length === 0;
                    }
                };

            }());

        },



        createSlideWatcherManager = function () {
            return (function () {

                var watchers = {},
                    startFrames = {};


                return {
                    "add": function (watcher) {

                        if (!this.hasListForSlide(watcher.slideNumber)) {

                            watchers[watcher.slideNumber] = createWatcherManager();

                        }

                        watchers[watcher.slideNumber].add(watcher);

                    },
                    "remove": function (watcher) {
                        if (this.hasListForSlide(watcher.slideNumber)) {

                            var slideManager = watchers[watcher.slideNumber];
                            slideManager.remove(watcher);

                            if (slideManager.isEmpty()) {
                                delete watchers[watcher.slideNumber];
                            }
                        }
                    },
                    "isEmpty": function () {
                        return _extra.w.Object.keys(watchers).length === 0;
                    },
                    "hasListForSlide": function (slideNumber) {
                        return watchers.hasOwnProperty(slideNumber);
                    },
                    "loop":function (frameNumber) {

                        var slide = _extra.slideManager.currentSlideNumber;

                        if (this.hasListForSlide(slide)) {

                            // Ensure we have the start frame for this slide

                            if (!startFrames.hasOwnProperty(slide)) {

                                var data = _extra.slideManager.getSlideData(slide);
                                startFrames[slide] = data.startFrame;

                            }

                            frameNumber = frameNumber - startFrames[slide];

                            watchers[_extra.slideManager.currentSlideNumber].loop(frameNumber);



                        }

                    }
                };


            }());
        },
        watchers = {
            "project": createWatcherManager(), // To be implemented later if needed.
            "slides": createSlideWatcherManager()
        };





////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
//////////////////// PUBLIC INTERFACE
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////

    _extra.timekeeper = {

        "conformsToInterface": function (watcher) {
            return watcher !== null &&
                   typeof watcher.startFrame   === "number" &&
                   typeof watcher.endFrame     === "number" &&
                   typeof watcher.enter        === "function" &&
                   typeof watcher.exit         === "function" &&
                   typeof watcher.isSlideBased === "boolean" &&
                   typeof watcher.slideNumber  === "number";
        },


        "addWatch": function(watcher) {


            if (!_extra.timekeeper.conformsToInterface(watcher)) {
                _extra.error("Tried to add a watcher to _extra.timekeeper.addWatch() " +
                             "which did not conform to the watcher interface");
                return;
            }

            if (watcher.isSlideBased) {
                watchers.slides.add(watcher);
            } else {
                watchers.project.add(watcher);
            }

            addListenerIfNeedBe();

        },

        "removeWatch": function(watcher) {
            if (watcher && watcher.isSlideBased) {
                watchers.slides.remove(watcher);
            } else {
                watchers.project.remove(watcher);
            }

            removeListenerIfNeedBe();
        }

    };

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// PRIVATE METHODS
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////

    function addListenerIfNeedBe () {

        if (!_extra.eventManager.eventDispatcher.hasListenerFor("newframe")) {
            _extra.eventManager.eventDispatcher.addEventListener("newframe", loop);
        }

    }

    function removeListenerIfNeedBe () {
        if (watchers.project.isEmpty() && watchers.slides.isEmpty()) {
            _extra.eventManager.eventDispatcher.removeEventListener("newframe", loop);
        }
    }

    function loop () {
        watchers.project.loop(_extra.movieStatus.currentFrame);
        watchers.slides.loop(_extra.movieStatus.currentFrame);
    }

});