/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 27/09/15
 * Time: 8:10 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("variableManager_software", ["softwareInterfacesManager", "Callback"], function () {

    "use strict";
    //var variables = _extra.storyline

    _extra.variableManager = {
        //"prefixCallback": new _extra.classes.Callback(),
        "getVariableValue": function (variableName) {
            return _extra.storyline.player.GetVar(variableName);
        },
        "setVariableValue": function (variableName, value) {
            _extra.storyline.player.SetVar(variableName, value);
        },
        "hasVariable": function (variableName) {
            return _extra.storyline.variables.hasOwnProperty(variableName);
        },
        "internalListenForVariableChange": function (variableName, callback) {
            _extra.storyline.api.registerVariableEventSubscriber({
                "handleEvent":callback
            }, variableName, 0);
        },
        "internalStopListeningForVariableChange": function(variableName, callback) {
            var storylineEventSubscribers = _extra.storyline.api.eventSubscribers;

            for (var i = 0; i < storylineEventSubscribers.length; i += 1) {
                var subscriptionData = storylineEventSubscribers[i];

                if (subscriptionData.item.handleEvent === callback && subscriptionData.varname === variableName) {
                    storylineEventSubscribers.splice(i,1);
                    return;
                }

            }
            _extra.error("_extra.variableManager.stopListeningForVariableChange logic has yet to be implemented");
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

                    var defaultValue = _extra.variableManager.variableData[variableName];

                    if (defaultValue === undefined) {
                        _extra.error("CV050", variableName);
                    } else {
                        _extra.variableManager.setVariableValue(variableName, defaultValue);
                    }

                });
            }
        },*/
        "forEachVariable":function (method) {
            for (var name in _extra.storyline.variables) {
                if (_extra.storyline.variables.hasOwnProperty(name)) {

                    method({
                        "name":name,
                        "isSystemVariable": false
                    });

                }
            }
        }/*,
        // This can't be a private variable, because it must be shared with the onload callback,
        // and seeing as we are using eval to run all this code, the onload callback is unlinked.
        "variableData":null,
        "hasParsedVariables":false*/
    };

    /*return function () {

        var splitName,
            prefix;

        _extra.variableManager.variableData = {};

        for (var name in _extra.storyline.variables) {
            if (_extra.storyline.variables.hasOwnProperty(name)) {

                _extra.variableManager.variableData[name] = _extra.variableManager.getVariableValue(name);

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

        _extra.variableManager.hasParsedVariables = true;
        // Dispatch event to let the rest of the modules know the variables have been initialized.
        _extra.eventManager.eventDispatcher.dispatchEvent(_extra.createEvent("variablesInitialized"));

    };*/

}, _extra.STORYLINE);