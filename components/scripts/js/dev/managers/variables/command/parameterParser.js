/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 7:51 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("parameterParser", ["variableManager", "queryManager"], function () {

    "use strict";

    _extra.variableManager.parse = {
        "string":function (string, customType, preventRecursion) {

            // Remove spaces from value string
            if (string !== undefined && string.replace) {
                string = string.replace(/\s+/g,'');
            }

            var data = {
                "value": string,
                "isNumber": !_extra.w.isNaN(string)
            };

            if (data.isNumber) {

                data.value = _extra.w.parseFloat(string);
                data.isSlideObject = false;
                data.isVariable = false;
                data.isQuery = false;
                data.isBlank = false;

            } else if (string) {

                data.isBlank = false;
                data.isSlideObject = _extra.slideObjects.hasSlideObjectInProject(string);
                data.isVariable = _extra.variableManager.hasVariable(string);
                data.isQuery = _extra.isQuery(string);

                // If we have custom type and have not found it to match any of the other types.
                if (customType && !data.isSlideObject && !data.isVariable && !data.isQuery) {
                    data.isCustomType = customType(string, data);
                }

            } else {

                // Null string
                data.isSlideObject = false;
                data.isVariable = false;
                data.isQuery = false;
                data.isNumber = false;
                data.isBlank = true;

            }


            // Check variable data
            if (data.isVariable && !preventRecursion) {

                data.variable = _extra.variableManager.parse.string(_extra.variableManager.getVariableValue(string),
                                                                    customType, true);
                /*var value = _extra.variableManager.getVariableValue(string);
                data.isValueNumber = !_extra.w.isNaN(value);

                if (data.isValueNumber) {
                    value = _extra.w.parseFloat(value);
                    data.isValueSlideObject = false;
                } else if (value !== null) {
                    // Remove spaces from value string
                    value = value.replace(/\s+/g,'');
                    data.isValueSlideObject = _extra.slideObjects.hasSlideObjectInProject(value);
                    data.isValueQuery = value.indexOf(_extra.slideObjects.WILDCARD_CHARACTER) !== -1;
                }

                // Put at the end to ensure any changing of type is handled.
                data.variableValue = value;*/
            }

            return data;
        },
        "boolean": function (value) {

            function parseNumber(value) {
                return value > 0;
            }

            switch (typeof value) {

                case "number" :
                    return parseNumber(value);

                case "string":
                    if (isNaN(value)) {

                        value = value.toLowerCase();

                        return !(value === "false" || value === "no" || value === "fail" || value === "failure") ;

                    } else {

                        // This is a number in disguise!
                        return parseNumber(_extra.w.parseFloat(value));

                    }


                    break;

                default:
                    return null;

            }

        }
    };

});