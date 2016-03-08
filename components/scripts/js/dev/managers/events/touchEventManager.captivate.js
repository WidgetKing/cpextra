/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 21/12/15
 * Time: 1:35 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("touchEventManager", ["eventManager","slideObjectManager_global"], function () {

    "use strict";

    function onTouchStart(event) {
        var slideObject = _extra.slideObjects.getSlideObjectByDIV(event.target);
    }

    function onTouchEnd(event) {
        var slideObject = _extra.slideObjects.getSlideObjectByDIV(event.target);

        if (slideObject && _extra.slideObjects.states.doesSlideObjectHaveDownState(slideObject.name)) {

            // In this case we need to dispatch
            slideObject.dispatchEvent(_extra.eventManager.events.MOUSE_UP);

        }


    }

    if (true || _extra.eventManager.useTouchEvents) {

        _extra.w.document.addEventListener(_extra.eventManager.events.MOUSE_DOWN, onTouchStart);
        _extra.w.document.addEventListener(_extra.eventManager.events.MOUSE_UP, onTouchEnd);

    }

});