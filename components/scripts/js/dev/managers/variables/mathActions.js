/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/04/17
 * Time: 4:52 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("mathActions", ["variableManager"], function () {

    "use strict";

    function applyMethodToVariableValue (variableName, method) {
        var value = _extra.variableManager.getVariableValue(variableName);
        value = method(value);
        _extra.variableManager.setVariableValue(variableName, value);
    }

    _extra.variableManager.mathActions = {

        "random": function (variableName, upper, lower) {

            var value = _extra.w.Math.random();

            if (upper !== 1 || lower !== 0) {

                var diff = upper - lower;
                value *= diff;
                value += lower;
                value = _extra.w.Math.round(value);

            }

            _extra.variableManager.setVariableValue(variableName, value);

        },

        "round": function (variableName) {

            applyMethodToVariableValue(variableName, _extra.w.Math.round);

        },


        "floor": function (variableName) {

            applyMethodToVariableValue(variableName, _extra.w.Math.floor);

        },


        "ceil": function (variableName) {

            applyMethodToVariableValue(variableName, _extra.w.Math.ceil);

        },

        "roundTo": function (variableName, decimals, direction) {

            applyMethodToVariableValue(variableName, function (value) {

                // Shift decimal points up
                value *= Math.pow(10, decimals);
                // Round
                value = round(value);
                // Shift decimal points down
                value /= _extra.w.Math.pow(10, decimals);
                // Return
                return value;

            });

            function round (value) {

                switch (direction) {

                    case "up":
                        return _extra.w.Math.ceil(value);

                    case "down":
                        return _extra.w.Math.floor(value);

                    default :
                        return _extra.w.Math.round(value);

                }

            }

        }

    };

});