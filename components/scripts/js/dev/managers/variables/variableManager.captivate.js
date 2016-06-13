/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/09/15
 * Time: 9:02 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("variableManager_software", ["softwareInterfacesManager", "Callback", "CustomEvent", "queryManager"], function () {
    "use strict";
    //////////////////////////
    ////// Variable Manager Object Setup
    //////////////////////////
    _extra.variableManager = {
        //"prefixCallback":new _extra.classes.Callback(),
        "getVariableValue": function (variableName) {

            // If we're trying to access system variables, some system variables return inaccurate values through
            // variableManager.getVariableValue(). Instead access them through the window object.
            if (_extra.variableManager.isSystemVariable(variableName)) {
                return _extra.captivate.variables[variableName];
            } else {
                return _extra.captivate.variableManager.getVariableValue(variableName);
            }

        },
        "setVariableValue": function (variableName, value) {
            if (_extra.variableManager.hasVariable(variableName)) {
                _extra.captivate.variables[variableName] = value;
            }
            // No longer use the method below, as we found it did not trigger a variable changed event.
            // Go figure.
            //_extra.captivate.variableManager.setVariableValue(variableName, value);
        },
        "hasVariable": function (variableName) {
            if (_extra.variableManager.variableData) {
                return _extra.variableManager.variableData.hasOwnProperty(variableName);
            } else {
                return _extra.captivate.variables.hasOwnProperty(variableName);
            }
        },
        /*"isSystemVariable": function (variableName) {
            if (_extra.variableManager.variableData && _extra.variableManager.variableData[variableName] !== undefined) {
                return _extra.variableManager.variableData[variableName].isSystemVariable;
            } else {
                return false;
            }
        },*/
        "internalListenForVariableChange": function (variableName, callback) {
            _extra.captivate.eventDispatcher.addEventListener("CPAPI_VARIABLEVALUECHANGED",callback,variableName);
        },
        "internalStopListeningForVariableChange": function(variableName, callback) {
            _extra.captivate.eventDispatcher.removeEventListener("CPAPI_VARIABLEVALUECHANGED",callback,variableName);
        },
        /*"enactFunctionOnVariables": function (query, method) {
            if (_extra.isQuery(query)) {

                var list = _extra.queryList(query, _extra.variableManager.variableData);

                for (var i = 0; i < list.length; i += 1) {

                    method(list[i]);

                }

            } else {

                method(query);

            }
        },
        "reset": function (variableName) {

            if (_extra.variableManager.variableData) {
                _extra.variableManager.enactFunctionOnVariables(variableName, function (variableName) {

                    var variableData = _extra.variableManager.variableData[variableName];

                    if (variableData === undefined) {
                        _extra.error("CV050", variableName);
                    } else {
                        _extra.variableManager.setVariableValue(variableName, variableData.defaultValue);
                    }

                });
            }
        },*/
        "forEachVariable":function(method) {
            var varData,
                variableInfo = _extra.captivate.api.variablesManager.varInfos;

            for (var i = 0; i < variableInfo.length; i+=1) {

                varData = variableInfo[i];
                method({
                    "name":varData.name,
                    "isSystemVariable": varData.systemDefined
                });

            }

        }/*,
        // This can't be a private variable, because it must be shared with the onload callback,
        // and seeing as we are using eval to run all this code, the onload callback is unlinked.
        "variableData":null,
        "hasParsedVariables":false*/
    };


    /*return function () {

        var name,
            splitName,
            prefix,
            varData,
            variableInfo = _extra.captivate.api.variablesManager.varInfos;

        _extra.variableManager.variableData = {};

        for (var i = 0; i < variableInfo.length; i+=1) {
            varData = variableInfo[i];

            name = varData.name;
            _extra.variableManager.variableData[name] = {
                "defaultValue": _extra.variableManager.getVariableValue(name),
                "isSystemVariable": varData.systemDefined
            };

            if (!varData.systemDefined) {
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
                _extra.variableManager.prefixCallback.sendToCallback(prefix,name);

            }


        }

        _extra.variableManager.hasParsedVariables = true;
        // Dispatch event to let the rest of the modules know the variables have been initialized.
        _extra.eventManager.eventDispatcher.dispatchEvent(_extra.createEvent("variablesInitialized"));
    };*/

}, _extra.CAPTIVATE);