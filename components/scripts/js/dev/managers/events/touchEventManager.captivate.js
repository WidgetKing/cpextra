/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 21/12/15
 * Time: 1:35 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("touchEventManager", ["eventManager","slideObjectManager_global"], function () {

    "use strict";

    /*
     * This module has been created to aid mouse up events on mobile devices.
     * The Mouse Up event is not consistently dispatched on these devices, therefore we aid it here by listening
     * to the document for touch up. If that happens, then we dispatch mouse up on objects which have down states.
     *
     * This was causing an error with Drag and Drop interactions where when the drag object was clicked a slide object
     * proxy would be created for it, which it didn't like all that much.
     */

    function onTouchStart(event) {
        _extra.slideObjects.getSlideObjectByDIV(event.target);
    }

    function onTouchEnd(event) {

try {
        var slideObject = _extra.slideObjects.getSlideObjectByDIV(event.target);

        if (slideObject && _extra.slideObjects.states.doesSlideObjectHaveDownState(slideObject.name)) {

            // In this case we need to dispatch
            slideObject.dispatchEvent(_extra.eventManager.events.MOUSE_UP);

        }
} catch (err) {
  _extra.log(event.target);
  _extra.log("ERROR HERE2!");
}

    }

    // Apparently haven't found a reliable way to detect when the browser is using touch events.
    // For the moment we will always use this.
    if (true || _extra.eventManager.useTouchEvents) {

        _extra.w.document.addEventListener(_extra.eventManager.events.MOUSE_DOWN, onTouchStart);
        _extra.w.document.addEventListener(_extra.eventManager.events.MOUSE_UP, onTouchEnd);

    }

});
