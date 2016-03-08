/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/10/15
 * Time: 4:13 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("eventManager", ["EventMediator", "EventDispatcher", "slideObjectProxyAutoInstantiator"], function () {
    "use strict";

    var eventMediators = {},
        isMobile = 'ontouchstart' in _extra.w.document.documentElement;

    _extra.eventManager = {

        "useTouchEvents": isMobile,

        "eventDispatcher": new _extra.classes.EventDispatcher(),

        "getEventMediator": function (slideObjectName) {

            if (!eventMediators[slideObjectName]) {

                var mediator = new _extra.classes.EventMediator();

                // Unload event mediator when it runs out of listeners
                mediator.registerOnEmptyCallback(function () {
                    delete eventMediators[slideObjectName];
                });

                eventMediators[slideObjectName] = mediator;
            }

            // Check if a slide object needs to be created
            _extra.slideObjects.proxyAutoInstantiator.check(slideObjectName);

            return eventMediators[slideObjectName];
        },
        "hasEventMediatorFor":function (slideObjectName) {
            return eventMediators.hasOwnProperty(slideObjectName);
        },
        "events": {
            "MOUSE_DOWN": (isMobile) ? "touchstart" : "mousedown",
            "MOUSE_UP": (isMobile) ? "touchend" : "mouseup",
            "MOUSE_MOVE": (isMobile) ? "touchmove" : "mousemove",
            "MOUSE_OVER": "mouseover",
            "MOUSE_OUT": "mouseleave",
            "ROLLOVER": "mouseover",
            "ROLLOUT": "mouseout",
            "RIGHT_CLICK": "contextmenu", // rightclick
            "CLICK": "click",
            "DOUBLE_CLICK": "dblclick",
            "VIDEO_ENDED": "videoended",
            "AUDIO_ENDED": "audioended"
        }
    };

    // Ensure that if we have event data for a certain slide object, that a slide object proxy is created
    // for that object on entering its slide.
    _extra.slideObjects.proxyAutoInstantiator.registerModelLookup(_extra.eventManager.hasEventMediatorFor);

});