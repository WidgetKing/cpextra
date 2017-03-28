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
            return _extra.movieStatus.currentFrame < endFrame &&
                _extra.movieStatus.currentFrame >= startFrame;
        }

    };

    // Update current frame and alert rest of extra that the frame has changed.
    // This is read by the xinfoCourseElapsedTime variables.
    _extra.variableManager.listenForVariableChange("cpInfoCurrentFrame", function () {

        _extra.movieStatus.currentFrame = _extra.variableManager.getVariableValue("cpInfoCurrentFrame");
        // dispatch new frame event
        _extra.eventManager.eventDispatcher.dispatchEvent(_extra.createEvent("newframe"));

    });


}, _extra.CAPTIVATE);