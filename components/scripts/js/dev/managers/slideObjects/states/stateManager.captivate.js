/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/10/15
 * Time: 7:18 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("stateManager_software",["Callback","slideObjectManager_global"],function () {
    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// Replace Native Change State Method
    ///////////////////////////////////////////////////////////////////////
    var nativeChangeStateMethod = _extra.captivate.api.changeState;
    _extra.captivate.api.changeState = function (slideObjectName, state) {

        var slideObjectData = _extra.dataManager.getSlideObjectDataByName(slideObjectName);

        // Sometimes (drag and drop interactions) Captivate may try to set an object to display a state
        // that doesn't exist. If that happens and we react to it, then that could cause errors in the slide
        // object proxy. Therefore, we must first check to see if this state exists before we tell slide objects
        // to react to it.
        if (slideObjectData.hasState(state)) {

            // Notify callbacks of state change.
            var changeDetails = {
                "slideObjectName":slideObjectName,
                "stateName": state
            };

            _extra.slideObjects.states.changeCallback.sendToCallback("*", changeDetails);
            _extra.slideObjects.states.changeCallback.sendToCallback(slideObjectName, changeDetails);

        }

        // We call the native function after the callbacks to avoid any 'mouse out' hijinks.
        nativeChangeStateMethod(slideObjectName, state);
    };
    ///////////////////////////////////////////////////////////////////////
    /////////////// Define Main Methods
    ///////////////////////////////////////////////////////////////////////

    _extra.slideObjects.states = {
        "change":function (query, state) {
            _extra.slideObjects.enactFunctionOnSlideObjects(query, function (slideObjectName) {
                _extra.captivate.api.changeState(slideObjectName, state);
            });
        },
        "fixMissingMouseOutIssue":function (internalStateData, nameProperty) {
            ///////// Fixes error where the 'mouseout' or 'mouseleave' event won't fire on button shapes.
            _extra.addHookBefore(internalStateData,"HandleMouseEventOnStateItems",function (eventName, internalStateIndex) {

                if (eventName === "mouseout") {

                    // All the mouse event calls are centralized to one of the states inside of the shape button object
                    // Therefore we have to work out whether this event is actually for the RollOver state.
                    var slideObject = _extra.slideObjects.getSlideObjectByName(this[nameProperty]);

                    if (slideObject) {

                        var actualStateData = slideObject.data.getStateDataByInternalIndex(internalStateIndex);

                        // If so, then we'll dispatch a MOUSE_OUT event for xcmndAddEventListener to hear.
                        if (actualStateData.name === "RollOver") {
                            slideObject.dispatchEvent(_extra.eventManager.events.MOUSE_OUT);
                        }

                    }
                }
            });
        },
        "changeCallback": new _extra.classes.Callback()
    };

}, _extra.CAPTIVATE);