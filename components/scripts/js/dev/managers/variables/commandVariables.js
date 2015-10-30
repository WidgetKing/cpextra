/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 9:38 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("commandVariables",["generalVariableManager","stateManager_global"], function () {

    "use strict";

    var COMMAND_VARIABLE_PREFIX = "xcmnd",
        variableName,
        commandVariables = {};

    ////////////////////////////////
    ////////// Parameter Handler Types

    // When a command variable is sent something like: 1,2,3,4
    // These functions decide how the parameters should be sent to the function tied into the variable.
    _extra.variableManager.parameterHandlers = {
        // This one sends them like this:
        // callback(1,2,3,4);
        "sendParametersAsParameters": function (parameters, callback) {
            callback.apply(_extra, parameters);
        },
        // This one sends them like this:
        // callback(1);
        // callback(2);
        // callback(3);
        // callback(4);
        "executeOncePerParameter": function (parameters, callback) {

            for (var i = 0; i < parameters.length; i += 1) {

                callback(parameters[i]);

            }

        }
    };

    ////////////////////////////////
    ////////// registerCommandVariable method

    // There may be other parts of the program who wish to register their own command variables (perhaps individual ones for Captivate or Storyline)
    // So we expose function to allow them to register.
    _extra.variableManager.registerCommandVariable = function (variableSuffix, callback, parameterHandler) {
        if (commandVariables[variableSuffix]) {
            return;
        }

        if (!parameterHandler) {

            // Default method for parameter handling is to invoke the callback once for each parameter.
            parameterHandler = _extra.variableManager.parameterHandlers.executeOncePerParameter;

        }

        commandVariables[variableSuffix] = {
            "callback":callback,
            "parameterHandler": parameterHandler
        };
    };


    ///////////////////////////////////////////////////////////////////////
    /////////////// LIST OF COMMAND VARIABLES
    ///////////////////////////////////////////////////////////////////////
    _extra.variableManager.registerCommandVariable("Hide", _extra.slideObjects.hide);
    _extra.variableManager.registerCommandVariable("Show", _extra.slideObjects.show);
    _extra.variableManager.registerCommandVariable("Enable", _extra.slideObjects.enable);
    _extra.variableManager.registerCommandVariable("Disable", _extra.slideObjects.disable);
    _extra.variableManager.registerCommandVariable("EnableForMouse", _extra.slideObjects.enableForMouse);
    _extra.variableManager.registerCommandVariable("DisableForMouse", _extra.slideObjects.disableForMouse);

    _extra.variableManager.registerCommandVariable("ChangeState", _extra.slideObjects.states.change,
                                                   _extra.variableManager.parameterHandlers.sendParametersAsParameters);




    ///////////////////////////////////////////////////////////////////////
    /////////////// SETTING UP COMMAND VARIABLES
    ///////////////////////////////////////////////////////////////////////
    return function () {



        function listenForCommandVariableChange(variableName,variableMetadata) {

            _extra.variableManager.listenForVariableChange(variableName, function () {


                var value = _extra.variableManager.getVariableValue(variableName);

                // If we have been given nothing, then we will not bother informing the command variable.
                // This likely comes from clearing the command variable after enacting its command.
                if (value !== "") {

                    // Remove spaces from value string
                    value = value.replace(/\s+/g,'');
                    var parameters = value.split(",");
                    variableMetadata.parameterHandler(parameters, variableMetadata.callback);
                    _extra.variableManager.setVariableValue(variableName,"");

                }


            });
        }

        // We will now go through all the command variables and set them up.
        for (var variableSuffix in commandVariables) {
            if (commandVariables.hasOwnProperty(variableSuffix)) {

                variableName = COMMAND_VARIABLE_PREFIX + variableSuffix;



                // Check to find valid variable.
                if (!_extra.variableManager.hasVariable(variableName)) {

                    // Variable with normal name doesn't exist. Try to find one with a semicolon in front.
                    variableName = "_" + variableName;

                    if (!_extra.variableManager.hasVariable(variableName)) {

                        // There is no valid variable by this name. Continue to the next one.
                        continue;

                    }

                }

                // Now set up the variable's behaviour
                listenForCommandVariableChange(variableName, commandVariables[variableSuffix]);

            }
        }


        // Unload
        commandVariables = null;
        _extra.variableManager.registerCommandVariable = null;
        _extra.variableManager.parameterHandlers = null;

    };





});