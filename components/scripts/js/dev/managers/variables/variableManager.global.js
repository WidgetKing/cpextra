/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/03/16
 * Time: 2:02 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("variableManager", ["variableManager_software", "VariableEventManager"], function () {

    "use strict";

    var variableEventManager = new _extra.classes.VariableEventManager(
            _extra.variableManager.internalListenForVariableChange,
            _extra.variableManager.internalStopListeningForVariableChange);

    _extra.variableManager.variableData = null;
    _extra.variableManager.hasParsedVariables = false;
    _extra.variableManager.prefixCallback = new _extra.classes.Callback();

    _extra.variableManager.commands = {};

    ///////////////////////////////////////////////////////////////////////
    /////////////// Variable Event Listeners
    ///////////////////////////////////////////////////////////////////////
    _extra.variableManager.listenForVariableChange = function (variableName, callback) {
        variableEventManager.addListener(variableName, callback);
    };

    _extra.variableManager.stopListeningForVariableChange = function(variableName, callback) {
        variableEventManager.removeListener(variableName, callback);
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// @Syntax
    ///////////////////////////////////////////////////////////////////////
    _extra.variableManager.enactFunctionOnVariables = function (query, method) {

        if (_extra.isQuery(query)) {

            var list = _extra.queryList(query, _extra.variableManager.variableData);

            if (list) {

                for (var i = 0; i < list.length; i += 1) {

                    method(list[i]);

                }

            }

        } else {

            method(query);

        }

    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// Utils
    ///////////////////////////////////////////////////////////////////////
    _extra.variableManager.isSystemVariable = function (variableName) {
        if (_extra.variableManager.variableData && _extra.variableManager.variableData[variableName] !== undefined) {
            return _extra.variableManager.variableData[variableName].isSystemVariable;
        } else {
            return false;
        }
    };


    _extra.variableManager.reset = function (variableName) {

        if (_extra.variableManager.variableData) {

            var variableData = _extra.variableManager.variableData[variableName];

            if (variableData) {
                _extra.variableManager.setVariableValue(variableName, variableData.defaultValue);
            }

        }
    };






    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// On load callback
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    return function () {


        _extra.variableManager.variableData = {};

        _extra.variableManager.forEachVariable(function (varData) {

            var name = varData.name,
                splitName,
                prefix;

            // Add this variable to records.
            _extra.variableManager.variableData[name] = {
                "defaultValue": _extra.variableManager.getVariableValue(name),
                "isSystemVariable": varData.isSystemVariable
            };

            if (!varData.isSystemVariable) {

                // This is a user variable
                splitName = name.split("_");
                prefix = splitName[0];

                // To support all variables as having an underscore '_' in front of their name
                // we'll check if the first index is empty (as would be true in a variable name such as _ls_myVariable)
                // If so, we'll use the second index as the variable's prefix (in that example it would be 'ls')
                if (prefix === "") {
                    prefix = splitName[1];
                }

                prefix = prefix.toLowerCase();
                // If someone has added a callback for this kind of prefix.
                _extra.variableManager.prefixCallback.sendToCallback(prefix, name);

            }

        });

        _extra.variableManager.hasParsedVariables = true;
        // Dispatch event to let the rest of the modules know the variables have been initialized.
        _extra.eventManager.eventDispatcher.dispatchEvent(_extra.createEvent("variablesInitialized"));

    };

});
