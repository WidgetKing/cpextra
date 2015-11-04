/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/09/15
 * Time: 9:02 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("variableManager", ["softwareInterfacesManager", "Callback"], function () {
    "use strict";

    var variableInfo = _extra.captivate.api.variablesManager.varInfos;

    //////////////////////////
    ////// Variable Manager Object Setup
    //////////////////////////
    _extra.variableManager = {
        "prefixCallback":new _extra.classes.Callback(),
        "getVariableValue": function (variableName) {
            return _extra.captivate.interface.getVariableValue(variableName);
        },
        "setVariableValue": function (variableName, value) {
            _extra.captivate.interface.setVariableValue(variableName, value);
        },
        "hasVariable": function (variableName) {
            return _extra.captivate.variables.hasOwnProperty(variableName);
        },
        "listenForVariableChange": function (variableName, callback) {
            _extra.captivate.eventDispatcher.addEventListener("CPAPI_VARIABLEVALUECHANGED",callback,variableName);
        },
        "stopListeningForVariableChange": function(variableName, callback) {
            _extra.captivate.eventDispatcher.removeEventListener("CPAPI_VARIABLEVALUECHANGED",callback,variableName);
        }
    };


    return function () {

        var name,
            splitName,
            prefix,
            varData;

        for (var i = 0; i < variableInfo.length; i+=1) {
            varData = variableInfo[i];

            if (!varData.systemDefined) {
                // This is a user variable

                name = varData.name;
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
                _extra.variableManager.prefixCallback.sendToCallback(prefix,name);

            }

        }

        // Dispatch event to let the rest of the modules know the variables have been initialized.
        _extra.eventDispatcher.dispatchEvent(new Event("variablesInitialized"));

    };

}, _extra.CAPTIVATE);