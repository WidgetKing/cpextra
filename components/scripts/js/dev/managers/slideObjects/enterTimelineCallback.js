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
    var handlers = {};

    function addHandler(slideObject, handler) {
        slideObject.addEventListener(_extra.eventManager.events.ENTER, handler);
        handlers[slideObject.name] = handler;
    }

    function removeHandler(slideObject) {

        var handler = handlers[slideObject.name];

        if (handler) {

            slideObject.removeEventListener(_extra.eventManager.events.ENTER, handler);
            delete handlers[slideObject.name];

        }

    }

    function getHandler(slideObjectName) {
        return handlers[slideObjectName];
    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// Callback
    ///////////////////////////////////////////////////////////////////////
    _extra.slideObjects.enterTimelineCallback = new _extra.classes.Callback();

    ///////////////////////////////////////////////////////////////////////
    /////////////// Add Callback
    ///////////////////////////////////////////////////////////////////////
    _extra.addHookBefore(_extra.slideObjects.enterTimelineCallback, "addCallback", function (slideObjectName) {

        var slideObject = _extra.slideObjects.getSlideObjectByName(slideObjectName);
        var enterTimelineHandler = function () {
            _extra.slideObjects.enterTimelineCallback.sendToCallback(slideObjectName);
        };

        if (!_extra.slideObjects.enterTimelineCallback.hasCallbackFor(slideObjectName)) {

            addHandler(slideObject, enterTimelineHandler);

        }

    });

    ///////////////////////////////////////////////////////////////////////
    /////////////// Remove Callback
    ///////////////////////////////////////////////////////////////////////
    _extra.addHookAfter(_extra.slideObjects.enterTimelineCallback, "removeCallback", function (slideObjectName) {

        var slideObject = _extra.slideObjects.getSlideObjectByName(slideObjectName);

        if (slideObject && !_extra.slideObjects.enterTimelineCallback.hasCallbackFor(slideObjectName)) {

            removeHandler(slideObject);

        }


    });


});
