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

    function processRegistration(data) {
        /*var example = {
            "EnableMouseEvents":{
                "parameterHandler":handlers.sendParametersAsParameters
                "commandName":"enableMouseEvents",
                "updateData":function (data, a, b) {

                }
                "parseSet":_extra.variableManager.parseSets.SP.CD.SOR,
                "parseSetData":{
                    "anything":null
                }
            }
        };*/

        function entryPoint() {
            for (var variableName in data) {
                if (data.hasOwnProperty(variableName)) {

                    registerVariable(variableName, data[variableName]);

                }
            }
        }

        function registerVariable(variableName, data) {

            function entryPoint() {

                _extra.variableManager.commands[data.commandName] = handleVariableChange;

                // Register
                _extra.variableManager.registerCommandVariable(variableName, handleVariableChange,
                    data.parameterHandler);

            }

            function handleVariableChange () {

                if (data.updateData) {

                    // Make the first parameter the parseSetData
                    Array.prototype.unshift.call(arguments, data.parseSetData);
                    // Update data to the parameters we've received
                    data.updateData.apply(this, arguments);

                    data.parseSet(data.parseSetData);

                } else {

                    _extra.error("You forgot to add a data.updateData method");

                }

            }

            entryPoint();

        }


        entryPoint();


    }

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
    register("EnableMouseEvents", _extra.variableManager.commands.enableMouseEvents);

    _extra.variableManager.commands.disableMouseEvents = function (query) {
        _extra.variableManager.parseSets.SP.CD.SOR(query, function (slideObjectName) {

            _extra.slideObjects.model.write(slideObjectName, "enableForMouse", false);

        });
    };

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
    _extra.variableManager.commands.setCursor = function (query, cursorName) {

        _extra.variableManager.parseSets.MP.SOR_STR(query, cursorName, function (slideObjectName, cursorName) {

            _extra.slideObjects.setCursor(slideObjectName, cursorName);

        });

    };

    register("SetCursor", _extra.variableManager.commands.setCursor, handlers.sendParametersAsParameters);

    ///////////////////////////////////////////////////////////////////////
    /////////////// ACTIONS
    ///////////////////////////////////////////////////////////////////////
    ////////////////////////////////
    ////////// Call Action On
    _extra.variableManager.commands.callActionOn = function (query, actionName) {

        _extra.variableManager.parseSets.MP.SOR_STR(query, actionName, function (slideObjectName, cursorName) {

            _extra.actionManager.callActionOn(slideObjectName, cursorName);

        });

    };
    // Note: This doesn't work with @ syntax
    register("CallActionOn", _extra.variableManager.commands.callActionOn,
             handlers.sendParametersAsParameters);

    ////////////////////////////////
    ////////// Position
    register("PosX", _extra.slideObjects.posX, handlers.sendParametersAsParameters);
    register("PosY", _extra.slideObjects.posY, handlers.sendParametersAsParameters);

    ////////////////////////////////
    ////////// Width / Height
    register("Width", _extra.slideObjects.width, handlers.sendParametersAsParameters);
    register("Height", _extra.slideObjects.height, handlers.sendParametersAsParameters);





});