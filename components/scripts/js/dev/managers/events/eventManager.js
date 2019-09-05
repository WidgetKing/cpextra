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

        "lastEventTarget":undefined,

        "eventDispatcher": new _extra.classes.EventDispatcher(),

        "addEventListener": function (slideObjectName, event, interactiveObject, criteria) {

            var mediator = _extra.eventManager.getEventMediator(slideObjectName);

            if (mediator) {

                mediator.addEventListener(event, interactiveObject, criteria);

            }

        },

        "removeEventListener": function (slideObjectName, event, interactiveObject, criteria) {

            var mediator = _extra.eventManager.getEventMediator(slideObjectName);

            if (mediator) {

                mediator.removeEventListener(event, interactiveObject, criteria);

            }

        },

        "getEventMediator": function (slideObjectName) {

            if (!eventMediators[slideObjectName]) {

                var mediator = new _extra.classes.EventMediator();
                mediator.setId(slideObjectName);

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
        "setEventTarget":function(targetName) {
            _extra.eventManager.lastEventTarget = targetName;
        },
        "events": {
            "MOUSE_DOWN": (isMobile) ? "touchstart" : "mousedown",
            "MOUSEDOWN": (isMobile) ? "touchstart" : "mousedown",
            "MOUSE_UP": (isMobile) ? "touchend" : "mouseup",
            "MOUSEUP": (isMobile) ? "touchend" : "mouseup",
            "MOUSE_MOVE": (isMobile) ? "touchmove" : "mousemove",
            "MOUSEMOVE": (isMobile) ? "touchmove" : "mousemove",
            "MOUSE_OVER": "mouseover",
            "MOUSEOVER": "mouseover",
            "MOUSE_OUT": "mouseleave",
            "MOUSEOUT": "mouseleave",
            "ROLLOVER": "mouseover",
            "ROLLOUT": "mouseout",
            "RIGHT_CLICK": "contextmenu", // rightclick
            "RIGHTCLICK": "contextmenu", // rightclick
            "CLICK": "click",
            "DOUBLE_CLICK": "dblclick",
            "DOUBLECLICK": "dblclick",
            "DBLCLICK": "dblclick",
            "ENTER":"enter",
            "EXIT":"exit",
            "VIDEO_ENDED": "videoended",
            "VIDEOENDED": "videoended",
            "VIDEO_END": "videoended",
            "VIDEOEND": "videoended",
            "AUDIO_ENDED": "audioended",
            "AUDIOENDED": "audioended",
            "AUDIO_END": "audioended",
            "AUDIOEND": "audioended",
            "LOADED": "loaded",
            "ERROR": "error"
        }
    };

    // Ensure that if we have event data for a certain slide object, that a slide object proxy is created
    // for that object on entering its slide.
    _extra.slideObjects.proxyAutoInstantiator.registerModelLookup(_extra.eventManager.hasEventMediatorFor);

});
