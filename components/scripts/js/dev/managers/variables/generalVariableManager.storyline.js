/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/09/15
 * Time: 8:10 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("generalVariableManager", ["softwareInterfacesManager", "Callback"], function () {

    "use strict";
    //var variables = _extra.storyline

    _extra.variableManager = {
        "prefixCallback": new _extra.classes.Callback(),
        "getVariableValue": function (variableName) {
            return _extra.storyline.player.GetVar(variableName);
        },
        "setVariableValue": function (variableName, value) {
            _extra.storyline.player.SetVar(variableName, value);
        },
        "hasVariable": function (variableName) {
            return _extra.storyline.variables[variableName] !== undefined;
        },
        "listenForVariableChange": function (variableName, callback) {
            _extra.error("_extra.variableManager.listenForVariableChange logic has yet to be implemented");
        },
        "stopListeningForVariableChange": function(variableName, callback) {
            _extra.error("_extra.variableManager.stopListeningForVariableChange logic has yet to be implemented");
        }
    };

    return function () {

        var splitName,
            prefix;

        for (var name in _extra.storyline.variables) {
            // TODO: Find a way to extract this so that the Captivate and Storyline versions aren't duplicating the same code.
            if (_extra.storyline.variables.hasOwnProperty(name)) {

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
        }

        // Dispatch event to let the rest of the modules know the variables have been initialized.
        _extra.eventDispatcher.dispatchEvent(new Event("variablesInitialized"));

    };

}, _extra.STORYLINE);