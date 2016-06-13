/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 11:15 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("slideObjectUtilMethods", ["slideObjectManager_global", "eventManager"], function () {

    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// PROPERTY COMMAND
    ///////////////////////////////////////////////////////////////////////
    function isValidPropertyStringType(string) {
        switch (string.toLowerCase()) {

            case "default" :
            case "reset" :
            case "original" :
                    return true;

        }

        return false;
    }

    function handlePropertyCommand(p1, p2, modelProperty, onlyGetter) {

        // Here are the following possibilities of what's been passed in.
        ////// SET
        // slideObjectName, 100 (number)
        // slideObjectName, variable (number)
        // slide@Name, 100
        // slide@Name, variable (number)
        // variable, 100
        // variable, variable (number)
        ////// GET
        // variable, slideObjectName
        // variable, variable (slideObject)
        var p1Data = _extra.variableManager.parse.string(p1),
            p2Data = _extra.variableManager.parse.string(p2, isValidPropertyStringType);


        ////////////////////////////////
        ////////// GETTER
        function setVariable(slideObjectName) {

            var valueToSet,
                slideObject = _extra.slideObjects.getSlideObjectByName(slideObjectName);

            onlyGetter = true;

            if (slideObject) {

                valueToSet = slideObject[modelProperty];

            } else {

                // We have a valid slide object, but it's just not on the slide at the moment.
                // Therefore we'll grab this information from the model.
                valueToSet = _extra.slideObjects.model.retrieve(slideObjectName, modelProperty);

            }

            _extra.variableManager.setVariableValue(p1, valueToSet);
        }

        if (p1Data.isVariable && !p1Data.variable.isSlideObject && !p1Data.variable.isQuery) {

            if (p2Data.isVariable) {
                p2Data = p2Data.variable;
            }

            if (p2Data.isSlideObject) {

                setVariable(p2Data.value);

            } else {

                _extra.error("CV042", p1, p2Data.value, modelProperty);
                return;

            }

        }


        // For some of the properties, like width and height, we may not want to be able to change the value.
        // So we escape here.
        if (onlyGetter) {

            // Check for an error here
            if (!p1Data.isVariable && !p1Data.isSlideObject) {
                _extra.error("CV040", p1, modelProperty);
            }

            return;
        }



        ////////////////////////////////
        ////////// SETTER
        function setModel(slideObjectName) {

            if (p2Data.isVariable) {

                p2 = p2Data.variable.value;
                p2Data = p2Data.variable;

            }

            if (!p2Data.isNumber && !p2Data.isCustomType) {
                _extra.error("CV041", slideObjectName, modelProperty, p2);
                return; // Don't proceed and cause errors.
            }

            _extra.slideObjects.model.write(slideObjectName, modelProperty, p2);
        }


        function detectP1Type() {

            if (p1Data.isSlideObject) {

                setModel(p1);

            } else if (p1Data.isVariable) {

                // This is better off restarting the whole process.
                p1 = p1Data.variable.value;
                p1Data = p1Data.variable;
                return detectP1Type();

            } else if (p1Data.isQuery) {

                _extra.slideObjects.enactFunctionOnSlideObjects(p1, function (slideObjectName) {

                    setModel(slideObjectName);

                });

            } else {

                // Not a valid type for the first parameter
                _extra.error("CV040", p1, modelProperty);

            }

        }

        detectP1Type();
    }





    ///////////////////////////////////////////////////////////////////////
    /////////////// EVENT TYPES
    ///////////////////////////////////////////////////////////////////////
    var MOUSE_EVENT = "mouseevent",
        SLIDE_OBJECT_EVENT = "slideobject",
        VIDEO_EVENT = "videoevent",
        AUDIO_EVENT = "audioevent",
        cursorTypes = {
            "auto":true,
            "default":true,
            "none":true,
            "context-menu":true,
            "help":true,
            "pointer":true,
            "progress":true,
            "wait":true,
            "cell":true,
            "crosshair":true,
            "text":true,
            "vertical-text":true,
            "alias":true,
            "copy":true,
            "move":true,
            "no-drop":true,
            "not-allowed":true,
            "all-scroll":true,
            "col-resize":true,
            "row-resize":true,
            "n-resize":true,
            "e-resize":true,
            "s-resize":true,
            "w-resize":true,
            "ne-resize":true,
            "nw-resize":true,
            "se-resize":true,
            "sw-resize":true,
            "ew-resize":true,
            "ns-resize":true,
            "nesw-resize":true,
            "nwse-resize":true,
            "zoom-in":true,
            "zoom-out":true,
            "grab":true,
            "grabbing":true
        },
        eventTypes = {
            "enter":{
                "type":SLIDE_OBJECT_EVENT,
                "name": _extra.eventManager.events.ENTER
            },
            "exit":{
                "type":SLIDE_OBJECT_EVENT,
                "name": _extra.eventManager.events.EXIT
            },
            "mouseover":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.MOUSE_OVER
            },
            "mouseout":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.MOUSE_OUT
            },
            "rollover":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.MOUSE_OVER
            },
            "rollout":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.MOUSE_OUT
            },
            "mousedown":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.MOUSE_DOWN
            },
            "mouseup":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.MOUSE_UP
            },
            "mousemove":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.MOUSE_MOVE
            },
            "click":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.CLICK
            },
            "doubleclick":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.DOUBLE_CLICK
            },
            "dblclick":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.DOUBLE_CLICK
            },
            "rightclick":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.RIGHT_CLICK
            },
            "touchstart":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.MOUSE_DOWN
            },
            "touchend":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.MOUSE_UP
            },
            "touchmove":{
                "type": MOUSE_EVENT,
                "name": _extra.eventManager.events.MOUSE_MOVE
            },
            "videoended":{
                "type": VIDEO_EVENT,
                "name": _extra.eventManager.events.VIDEO_ENDED
            },
            "videoend":{
                "type": VIDEO_EVENT,
                "name": _extra.eventManager.events.VIDEO_ENDED
            },
            "audioended": {
                "type": AUDIO_EVENT,
                "name": _extra.eventManager.events.AUDIO_ENDED
            },
            "audioend": {
                "type": AUDIO_EVENT,
                "name": _extra.eventManager.events.AUDIO_ENDED
            }
        };

    function isEventType (string, data) {

        string = string.toLowerCase();

        if (eventTypes[string]) {
            data.eventType = eventTypes[string];
            return true;
        } else {
            return false;
        }

    }

    function handleEventCommand (type, p1, p2, p3, p4) {
        // Here are the following possibilities for what can be passed in.
        // event (non mouse), interactiveObject
        // event (non mouse), interactiveObject, criteria
        // slideObjectName, event (mouse), interactiveObject
        // slideObjectName, event (mouse), interactiveObject, criteria
        // slide@Name, event (mouse), interactiveObject
        // slide@Name, event (mouse), interactiveObject, criteria
        var p1Data = _extra.variableManager.parse.string(p1, isEventType),
            p2Data = _extra.variableManager.parse.string(p2, isEventType),
            p3Data = _extra.variableManager.parse.string(p3),
            p4Data = _extra.variableManager.parse.string(p4);


        ///////////////////////////////////////////////////////////////////////
        /////////////// WRITE
        ///////////////////////////////////////////////////////////////////////
        function addToMediator(mediator, eventData, interactiveObjectData, criteriaData){

            if (eventData.isCustomType) {

                if (interactiveObjectData.isSlideObject) {

                    var criteria;

                    if (criteriaData.isBlank) {
                        criteria = "success";
                    } else {
                        criteria = criteriaData.value;
                    }

                    // Now we will add the event listener!
                    // ... Or remove it as the case may be.
                    mediator[type](eventData.eventType.name, interactiveObjectData.value, criteria);

                } else {

                    // The object passed in as an 'interactive object' is not a slide object at all.
                    _extra.error("CV013", interactiveObjectData.value);

                }

            } else {

                // The event data is invalid
                _extra.error("CV031", eventData.value, type);

            }

        }



        ///////////////////////////////////////////////////////////////////////
        /////////////// READ
        ///////////////////////////////////////////////////////////////////////
        function detectP1Type() {

            if (p1Data.isSlideObject) {

                addToMediator(_extra.eventManager.getEventMediator(p1), p2Data, p3Data, p4Data);

            } else if (p1Data.isVariable) {

                if (p1Data.variable.isQuery) {

                    // This is better off restarting the whole process.
                    p1 = p1Data.variable.value;
                    p1Data.isQuery = true;
                    p1Data.isSlideObject = false;
                    p1Data.isVariable = false;
                    return detectP1Type();

                } else {

                    addToMediator(_extra.eventManager.getEventMediator(p1Data.variable.value), p2Data, p3Data, p4Data);

                }

            } else if (p1Data.isQuery) {

                _extra.slideObjects.enactFunctionOnSlideObjects(p1, function (slideObjectName) {

                    addToMediator(_extra.eventManager.getEventMediator(slideObjectName), p2Data, p3Data, p4Data);

                });

            } else {

                // Not a valid type for the first parameter
                _extra.error("CV030", p1, type);

            }

        }

        // This is in a function because under certain circumstances we need to recurse it.
        detectP1Type();


    }


    ///////////////////////////////////////////////////////////////////////
    /////////////// Command Variables
    ///////////////////////////////////////////////////////////////////////
    _extra.slideObjects.enableForMouse = function (query) {

        _extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
            _extra.slideObjects.model.write(slideObjectName, "enableForMouse", true);
        });

    };
    _extra.slideObjects.disableForMouse = function (query) {


        _extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
            _extra.slideObjects.model.write(slideObjectName, "enableForMouse", false);
        });

    };
    _extra.slideObjects.setCursor = function (query, cursorType) {

        // Check we are setting a valid cursor.
        cursorType = cursorType.toLowerCase();
        if (!cursorTypes[cursorType]) {
            _extra.error("CV020", query, cursorType);
            return;
        }

        _extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
            _extra.slideObjects.model.write(slideObjectName, "cursor", cursorType);
        });

    };

    _extra.slideObjects.posX = function (p1, p2) {

        handlePropertyCommand(p1,p2,"x");

    };
    _extra.slideObjects.posY = function (p1, p2) {

        handlePropertyCommand(p1,p2,"y");

    };

    _extra.slideObjects.width = function (p1, p2) {

        handlePropertyCommand(p1,p2,"width", true);

    };
    _extra.slideObjects.height = function (p1, p2) {

        handlePropertyCommand(p1,p2,"height", true);

    };

    _extra.slideObjects.addEventListener = function (query, event, interactiveObject, criteria) {

        handleEventCommand("addEventListener",query,event,interactiveObject,criteria);

    };

    _extra.slideObjects.removeEventListener = function (query, event, interactiveObject, criteria) {

        handleEventCommand("removeEventListener",query,event,interactiveObject,criteria);

    };

});