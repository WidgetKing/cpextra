/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/09/16
 * Time: 6:33 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("stateDrawnDetector", ["stateManager_global"], function () {

    "use strict";

    _extra.slideObjects.states.callOnStateDrawn = function (slideObjectName, callback) {

        // In Captivate 9.0.2 with the new state system, we have to wait for drawComplete before css changes can
        // be made.
        var slideObjectData = _extra.dataManager.getSlideObjectDataByName(slideObjectName),
            nativeController = _extra.captivate.api.getDisplayObjByCP_UID(slideObjectData.uid),
            methodCalledInDrawComplete;

        function drawHandler() {

            if (callback) {
                callback();
                callback = null;
            }

        }

        function limitHandler() {

            if (callback) {

                _extra.removeHook(nativeController, "drawComplete", drawHandler);
                drawHandler();

            }

        }

        // Listen for the draw complete for one time
        _extra.addOneTimeHook(nativeController, "drawComplete", drawHandler);

        // If draw complete isn't called before the next frame, then we'll assume the shape has been drawn.
        _extra.executeOnNextFrame(limitHandler);


    };

}, _extra.CAPTIVATE);