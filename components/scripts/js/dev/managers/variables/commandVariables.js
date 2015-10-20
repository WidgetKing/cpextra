/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 9:38 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("commandVariables",["generalVariableManager","slideObjectManager_global"], function () {

    "use strict";

    var COMMAND_VARIABLE_PREFIX = "xcmnd",
        variableName,

        commandVariables = {};

    _extra.variableManager.registerCommandVariable = function (variableSuffix, callback, parameterHandler) {
        if (commandVariables[variableSuffix]) {
            return;
        }

        if (!parameterHandler) {

            // Default method for parameter handling is to invoke the callback once for each parameter.
            parameterHandler = function (parameters, callback) {

                for (var i = 0; i < parameters.length; i += 1) {

                    callback(parameters[i]);

                }

            };

        }

        commandVariables[variableSuffix] = {
            "callback":callback,
            "parameterHandler": parameterHandler
        };
    };

    ////////////////////////////////
    ////////// Parameter Handler Types
    function sendParametersAsParameters(parameters, callback) {
        callback.apply({}, parameters);
    }

    ///////////////////////////////////////////////////////////////////////
    /////////////// LIST OF COMMAND VARIABLES
    ///////////////////////////////////////////////////////////////////////
    _extra.variableManager.registerCommandVariable("Hide", _extra.slideObjects.hide);
    _extra.variableManager.registerCommandVariable("Show", _extra.slideObjects.show);
    _extra.variableManager.registerCommandVariable("Enable", _extra.slideObjects.enable);
    _extra.variableManager.registerCommandVariable("Disable", _extra.slideObjects.disable);

    _extra.variableManager.registerCommandVariable("ChangeState", _extra.slideObjects.changeState, sendParametersAsParameters);




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

    };





});