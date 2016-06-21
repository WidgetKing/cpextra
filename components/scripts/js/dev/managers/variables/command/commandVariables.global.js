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
    _extra.variableManager.commands.enableMouseEvents = function (query) {
        _extra.variableManager.parseSets.SP.CD.SOR(query, function (slideObjectName) {

            _extra.slideObjects.model.write(slideObjectName, "enableForMouse", true);

        });
    };


    _extra.variableManager.commands.disableMouseEvents = function (query) {
        _extra.variableManager.parseSets.SP.CD.SOR(query, function (slideObjectName) {

            _extra.slideObjects.model.write(slideObjectName, "enableForMouse", false);

        });
    };


    register("EnableMouseEvents", _extra.variableManager.commands.enableMouseEvents);
    register("DisableMouseEvents", _extra.variableManager.commands.disableMouseEvents);

    ////////////////////////////////
    ////////// Reset
    _extra.variableManager.commands.reset = function (query) {

        _extra.variableManager.parseSets.SP.CD.VR(query, _extra.variableManager.reset,
            // Report error if the variable name is invalid
            function (variableName) {
                _extra.error("CV050", variableName);
            });

    };
    register("Reset", _extra.variableManager.commands.reset);

    ////////////////////////////////
    ////////// Flush
    _extra.variableManager.commands.flushStorage = function (query) {

        _extra.variableManager.parseSets.SP.CD.VR(query, _extra.variableManager.flushStorage,
            // Report error if the variable name is invalid
            function (original, output) {

                var keyword = original.toLowerCase();

                // Check to see if we have a keyword here
                if (keyword === "local" || keyword === "session" || keyword === "all") {
                    output(keyword);
                } else {
                    _extra.error("CV050", original);
                }

            });

    };
    // TODO: The @syntax for this variable must only query local and session storage variables
    register("FlushStorage", _extra.variableManager.commands.flushStorage);

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