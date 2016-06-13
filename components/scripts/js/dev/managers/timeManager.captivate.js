/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 6/06/16
 * Time: 11:32 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("timeManager", ["variableManager", "eventManager"], function () {

    "use strict";

    // Get static info
    _extra.FPS = _extra.captivate.FPS;
    _extra.totalFrames = _extra.captivate.totalFrames;

    // Update current frame and alert rest of extra that the frame has changed.
    // This is read by the xinfoCourseElapsedTime variables.
    _extra.variableManager.listenForVariableChange("cpInfoCurrentFrame", function () {

        _extra.currentFrame = _extra.variableManager.getVariableValue("cpInfoCurrentFrame");
        // dispatch new frame event
        _extra.eventManager.eventDispatcher.dispatchEvent(_extra.createEvent("newframe"));

    });

}, _extra.CAPTIVATE);