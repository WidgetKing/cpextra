/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 18/09/16
 * Time: 8:09 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("enterTimelineCallback", ["hookManager", "slideObjectManager_global"], function () {

    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// Event Handling
    ///////////////////////////////////////////////////////////////////////
    function enteredSlideObjectTimeline(event) {
        _extra.log(event);
    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// Callback
    ///////////////////////////////////////////////////////////////////////
    _extra.slideObjects.enterTimelineCallback = new _extra.classes.Callback();

    _extra.addHookBefore(_extra.slideObjects.enterTimelineCallback, "addCallback", function (slideObjectName) {

        var slideObject = _extra.slideObjects.getSlideObjectByName(slideObjectName);

        slideObject.addEventListener(_extra.eventManager.events.ENTER, enteredSlideObjectTimeline);

    });

});