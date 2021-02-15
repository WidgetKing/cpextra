/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 9:38 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule(
  "commandVariableManager",
  ["variableManager", "stateManager_software", "whiteSpaceManager"],
  function() {
    "use strict";

    _extra.variableManager.commandVariables = {};

    ////////////////////////////////
    ////////// Parameter Handler Types

    // When a command variable is sent something like: 1,2,3,4
    // These functions decide how the parameters should be sent to the function tied into the variable.
    _extra.variableManager.parameterHandlers = {
      // This one sends them like this:
      // callback(1,2,3,4);
      sendParametersAsParameters: function(parameters, callback) {
        callback.apply(_extra, parameters);
      },
      // This one sends them like this:
      // callback(1);
      // callback(2);
      // callback(3);
      // callback(4);
      executeOncePerParameter: function(parameters, callback) {
        for (var i = 0; i < parameters.length; i += 1) {
          callback(parameters[i]);
        }
      }
    };

    ////////////////////////////////
    ////////// registerCommandVariable method

    // There may be other parts of the program who wish to register their own command variables (perhaps individual ones for Captivate or Storyline)
    // So we expose function to allow them to register.
    _extra.variableManager.registerCommandVariable = function(
      variableSuffix,
      callback,
      parameterHandler
    ) {
      if (_extra.variableManager.commandVariables[variableSuffix]) {
        return;
      }

      if (!parameterHandler) {
        // Default method for parameter handling is to invoke the callback once for each parameter.
        parameterHandler =
          _extra.variableManager.parameterHandlers.executeOncePerParameter;
      }

      _extra.variableManager.commandVariables[variableSuffix] = {
        callback: callback,
        parameterHandler: parameterHandler
      };
    };

    _extra.variableManager.prepareParameters = function(value) {
      // Div issue
      if (typeof value === "object") {
        if (value.id !== undefined) {
          value = value.id;
        } else {
          return null;
        }
      }

      // If we have been given nothing, then we will not bother informing the command variable.
      // This likely comes from clearing the command variable after enacting its command.
      if (value !== "") {
        if (typeof value === "string") {
          // Remove spaces and tabs and such, but not from inside double quotes
          value = _extra.variableManager.safelyRemoveWhiteSpace(
            value,
            "\u0000"
          );

          return value.split("\u0000");
        } else {
          // This is likely a number.
          return [value];
        }
      }

      return null;
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// SETTING UP COMMAND VARIABLES
    ///////////////////////////////////////////////////////////////////////
    return function() {
      var COMMAND_VARIABLE_PREFIX = "xcmnd",
        variableName;

      function listenForCommandVariableChange(variableName, variableMetadata) {
        _extra.variableManager.listenForVariableChange(
          variableName,
          function() {
            var value = _extra.variableManager.getVariableValue(variableName);
            var parameters = _extra.variableManager.prepareParameters(value);

            _extra.debugging.debug("Variable changed: " + variableName);
            _extra.debugging.debug("           Value: " + value);

            if (parameters) {
              variableMetadata.parameterHandler(
                parameters,
                variableMetadata.callback
              );
              _extra.variableManager.setVariableValue(variableName, "");
            }
          }
        );
      }

      ///////////////////////////////////////////////////////////////////////
      /////////////// Setting up registered command variables
      ///////////////////////////////////////////////////////////////////////
      // We will now go through all the command variables and set them up.
      function registerVariable(variableName) {
        if (_extra.variableManager.hasVariable(variableName)) {
          listenForCommandVariableChange(
            variableName,
            _extra.variableManager.commandVariables[variableSuffix]
          );
        }
      }

      // We will now go through all the command variables and set them up.
      for (var variableSuffix in _extra.variableManager.commandVariables) {
        if (
          _extra.variableManager.commandVariables.hasOwnProperty(variableSuffix)
        ) {
          variableName = COMMAND_VARIABLE_PREFIX + variableSuffix;

          registerVariable(variableName);
          registerVariable("_" + variableName);
        }
      }

      // Unload
      _extra.variableManager.commandVariables = null;
      _extra.variableManager.registerCommandVariable = null;
      _extra.variableManager.parameterHandlers = null;
    };
  }
);
