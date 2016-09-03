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
    _extra.addHookAfter(_extra.captivate.api, "changeState", function (slideObjectName, state) {

        var slideObjectData = _extra.dataManager.getSlideObjectDataByName(slideObjectName);

        // Sometimes (drag and drop interactions) Captivate may try to set an object to display a state
        // that doesn't exist. If that happens and we react to it, then that could cause errors in the slide
        // object proxy. Therefore, we must first check to see if this state exists before we tell slide objects
        // to react to it.
        if (slideObjectData && slideObjectData.hasState(state)) {

            // Notify callbacks of state change.
            var changeDetails = {
                "slideObjectName":slideObjectName,
                "stateName": state
            };

            // In Captivate 9.0.2 with the new state system, we have to wait for drawComplete before css changes can
            // be made.
            var nativeController = _extra.captivate.api.getDisplayObjByCP_UID(slideObjectData.uid);

            // Listen for the draw complete for one time
            _extra.addOneTimeHook(nativeController, "drawComplete", function () {

                _extra.slideObjects.states.changeCallback.sendToCallback("*", changeDetails);
                _extra.slideObjects.states.changeCallback.sendToCallback(slideObjectName, changeDetails);

            }, 1);
        }
    });
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