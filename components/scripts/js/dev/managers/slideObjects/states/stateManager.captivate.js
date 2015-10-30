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


        // Notify callbacks of state change.
        var changeDetails = {
            "slideObjectName":slideObjectName,
            "stateName": state
        };
        _extra.slideObjects.states.changeCallback.sendToCallback("*", changeDetails);
        _extra.slideObjects.states.changeCallback.sendToCallback(slideObjectName, changeDetails);

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
        "changeCallback": new _extra.classes.Callback()
    };

}, _extra.CAPTIVATE);