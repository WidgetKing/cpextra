/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 8:14 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("commandVariables_global", ["commandVariableManager", "slideObjectUtilMethods"], function () {

    "use strict";

    var register = _extra.variableManager.registerCommandVariable,
        handlers = _extra.variableManager.parameterHandlers;

    ///////////////////////////////////////////////////////////////////////
    /////////////// BASIC COMMAND VARIABLES
    ///////////////////////////////////////////////////////////////////////
    ////////////////////////////////
    ////////// Extend Captivate Functions
    register("Hide", _extra.slideObjects.hide);
    register("Show", _extra.slideObjects.show);
    register("Enable", _extra.slideObjects.enable);
    register("Disable", _extra.slideObjects.disable);

    register("ChangeState", _extra.slideObjects.states.change, handlers.sendParametersAsParameters);


    ////////////////////////////////
    ////////// Mouse Enable
    register("EnableForMouse", _extra.slideObjects.enableForMouse);
    register("DisableForMouse", _extra.slideObjects.disableForMouse);

    ///////////////////////////////////////////////////////////////////////
    /////////////// ADVANCED COMMAND VARIABLES
    ///////////////////////////////////////////////////////////////////////
    ////////////////////////////////
    ////////// Cursor
    register("SetCursor", _extra.slideObjects.setCursor, handlers.sendParametersAsParameters);

    ////////////////////////////////
    ////////// Position
    register("PosX", _extra.slideObjects.posX, handlers.sendParametersAsParameters);
    register("PosY", _extra.slideObjects.posY, handlers.sendParametersAsParameters);

    ////////////////////////////////
    ////////// Width / Height
    register("Width", _extra.slideObjects.width, handlers.sendParametersAsParameters);
    register("Height", _extra.slideObjects.height, handlers.sendParametersAsParameters);

    ////////////////////////////////
    ////////// Event Handler
    register("AddEventListener", _extra.slideObjects.addEventListener, handlers.sendParametersAsParameters);
    register("RemoveEventListener", _extra.slideObjects.removeEventListener, handlers.sendParametersAsParameters);



});