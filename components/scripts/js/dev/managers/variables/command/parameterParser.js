/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 7:51 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("parameterParser", ["variableManager"], function () {

    "use strict";

    _extra.variableManager.parse = {
        "string":function (string) {

            var data = {};

            data.isSlideObject = _extra.slideObjects.hasSlideObjectInProject(string);
            data.isVariable = _extra.variableManager.hasVariable(string);
            data.isQuery = string.indexOf(_extra.slideObjects.WILDCARD_CHARACTER) !== -1;

            // Check variable data
            if (data.isVariable) {

                var value = _extra.variableManager.getVariableValue(string);
                data.isValueNumber = !isNaN(value);

                if (data.isValueNumber) {
                    value = parseFloat(value);
                    data.isValueSlideObject = false;
                } else if (value !== null) {
                    // Remove spaces from value string
                    value = value.replace(/\s+/g,'');
                    data.isValueSlideObject = _extra.slideObjects.hasSlideObjectInProject(value);
                    data.isValueQuery = value.indexOf(_extra.slideObjects.WILDCARD_CHARACTER) !== -1;
                }

                // Put at the end to ensure any changing of type is handled.
                data.variableValue = value;
            }

            return data;
        }
    };

});