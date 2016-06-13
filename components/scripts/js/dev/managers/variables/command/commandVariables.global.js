/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 8:14 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("commandVariables_global", ["commandVariableManager", "slideObjectUtilMethods", "localStorageManager"], function () {

    "use strict";

    var register = _extra.variableManager.registerCommandVariable,
        handlers = _extra.variableManager.parameterHandlers;

    ///////////////////////////////////////////////////////////////////////
    /////////////// BASIC COMMAND VARIABLES
    ///////////////////////////////////////////////////////////////////////

    // Have been moved to existingActionCommandVariables


    ////////////////////////////////
    ////////// Mouse Enable
    register("EnableMouseEvents", _extra.slideObjects.enableForMouse);
    register("DisableMouseEvents", _extra.slideObjects.disableForMouse);

    ////////////////////////////////
    ////////// Reset
    register("Reset", _extra.variableManager.reset);

    ////////////////////////////////
    ////////// Flush
    register("FlushStorage", _extra.variableManager.flushStorage);

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





});