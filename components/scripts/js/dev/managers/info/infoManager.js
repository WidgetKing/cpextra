/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 22/12/15
 * Time: 4:10 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("infoManager", ["variableManager"], function () {

    "use strict";

    var PREFIX = "xinfo";

    _extra.infoManager = {

        "infoVariables":{

        },

        "registerInfoVariable": function (data) {

            data.name = PREFIX + data.suffix;

            if (_extra.variableManager.hasVariable(data.name)) {

                _extra.infoManager.infoVariables[data.name] = data;

                return true;

            }

            return false;

        }

    };

    return function () {

        var data,
            onSet = function(event) {
                // TODO: Abstract this so it's different in storyline (Probably best to proxy the event in the variable manager somehow)
                _extra.infoManager.infoVariables[event.Data.varName].setter(event.Data.newVal);
            },
            onGet = function(event) {
                return _extra.infoManager.infoVariables[event.variableName].getter();
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