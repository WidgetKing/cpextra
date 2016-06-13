/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 22/12/15
 * Time: 4:10 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("infoVariableManager", ["variableManager"], function () {

    "use strict";

    var PREFIX = "xinfo";

    _extra.infoManager = {

        "infoVariables":{

        },

        "registerInfoVariable": function (data) {

            function initVariable(name) {

                data.name = name;

                if (_extra.variableManager.hasVariable(data.name)) {

                    _extra.infoManager.infoVariables[data.name] = data;

                    return true;

                }

                return false;
            }

            if (initVariable(PREFIX + data.suffix)) {
                return true;

                // If the variable did not exist, check to see if there is one with an underscore at the front of its name.
            } else {
                return initVariable("_" + data.name);
            }

        }

    };

    return function () {

        var data,
            onSet = function(event) {

                var infoVariableData = _extra.infoManager.infoVariables[event.variableName],
                    variableValue = event.newValue;

                infoVariableData.setter(variableValue);
            },
            onGet = function(event) {
                var infoVariableData = _extra.infoManager.infoVariables[event.variableName];
                return infoVariableData.getter();
            };

        for (var variableName in _extra.infoManager.infoVariables) {
            if (_extra.infoManager.infoVariables.hasOwnProperty(variableName)) {

                data = _extra.infoManager.infoVariables[variableName];

                if (data.setter) {

                    _extra.variableManager.listenForVariableChange(variableName, onSet);

                }

                if (data.getter) {

                    _extra.variableManager.listenForVariableRead(variableName, onGet);

                }

            }
        }

    };

});