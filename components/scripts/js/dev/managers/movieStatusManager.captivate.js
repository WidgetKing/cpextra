/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/06/16
 * Time: 9:57 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("movieStatusManager", ["softwareInterfacesManager", "variableManager", "eventManager"], function () {

    "use strict";

    _extra.movieStatus = {

        "FPS":_extra.captivate.FPS,
        "totalFrames":_extra.captivate.totalFrames,

        "isPlaying" : function () {
            return !_extra.captivate.movie.paused;
        },

        "isPaused": function () {
            return _extra.captivate.movie.paused;
        },

        "isCurrentFrameWithinRange": function (startFrame, endFrame) {
            return _extra.movieStatus.currentFrame <= endFrame &&
                _extra.movieStatus.currentFrame >= startFrame;
        },

        "convertMillisecondToFrame": function (millisecond) {
            return _extra.w.Math.floor(millisecond * _extra.movieStatus.FPS / 1E3)
        }

    };

    // Update current frame and alert rest of extra that the frame has changed.
    // This is read by the xinfoCourseElapsedTime variables.
    _extra.variableManager.listenForVariableChange("cpInfoCurrentFrame", function () {

        var newFrameNumber = _extra.variableManager.getVariableValue("cpInfoCurrentFrame");
        newFrameNumber = _extra.w.Math.min(_extra.movieStatus.totalFrames, newFrameNumber);

        if (newFrameNumber !== _extra.movieStatus.currentFrame) {

            _extra.movieStatus.currentFrame = newFrameNumber;
            // dispatch new frame event
            _extra.eventManager.eventDispatcher.dispatchEvent(_extra.createEvent("newframe"));

        }


    });


}, _extra.CAPTIVATE);