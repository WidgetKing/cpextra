/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 3/11/15
 * Time: 7:51 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("parameterParser", ["variableManager", "queryManager", "whiteSpaceManager"], function () {

    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// Util Methods
    ///////////////////////////////////////////////////////////////////////

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// SubParsers
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    var subParsers = {

        ///////////////////////////////////////////////////////////////////////
        /////////////// String Parser Util Methods
        ///////////////////////////////////////////////////////////////////////
        "string": {

            "null":function (string, data) {
                // Null string
                data.isSlideObject = false;
                data.isVariable = false;
                data.isQuery = false;
                data.isNumber = false;
                data.isBlank = true;
                return string;
            },

            "number":function (string, data) {
                data.value = _extra.w.parseFloat(string);
                data.isSlideObject = false;
                data.isVariable = false;
                data.isQuery = false;
                data.isBlank = false;
                return string;
            },

            "explicitString":function (string, data) {
                 // Check for explicit String
                if (string.charAt(0) === '[' && string.charAt(string.length - 1) === ']') {

                    // Strip out the quotation marks
                    string = string.substr(1, string.length - 2);
                    data.value = string;
                    data.isString = true;

                }

                return string;
            },

            "string": function (string, data, customType) {

                data.isBlank = false;

                // Is this a string surrounded by double quotes "?"
                string = subParsers.string.explicitString(string, data);

                if (!data.isString) {

                    // Is this a variable surrounded by double dollar signs $$?$$
                    string = subParsers.string.$variable(string, data);

                    if (data.is$Variable) {
                        return string;
                    }
                }

                data.isSlideObject = _extra.slideObjects.hasSlideObjectInProject(string);
                data.isQuery = _extra.isQuery(string);
                // If we have explicitly set a string, that means we can't be pointing to a variable
                // It's the LAW
                data.isVariable = (data.isString) ? false : _extra.variableManager.hasVariable(string);

                // Check custom Types
                string = subParsers.string.customType(string, data, customType);

                return string;
            },

            "customType": function (string, data, customType) {
                // If we have custom type and have not found it to match any of the other types.
                if (customType && !data.isSlideObject && !data.isVariable && !data.isQuery) {
                    data.isCustomType = customType(string, data);
                }

                return string;
            },

            "$variable":function (string, data) {

                if (string.substr(0,2) === "$$" && string.substr(string.length - 2, 2) === "$$") {

                    string = string.substr(2, string.length - 4);
                    // Even though this is explicitly pointing to a variable, we have to check that the variable exists
                    // It may have been incorrectly written
                    data.isVariable = _extra.variableManager.hasVariable(string);
                    data.is$Variable = true;
                    data.isSlideObject = false;
                    data.isQuery = false;
                    data.value = string;

                    if (!data.isVariable) {
                        _extra.error("PE001", string);
                    }

                }

                return string;
            },

            "variable": function (string, data, customType) {

                var variableValue = _extra.variableManager.getVariableValue(string);

                // Remove spaces from value string
                if (variableValue !== undefined && variableValue.replace) {
                    // Remove spaces and tabs and such
                    variableValue = _extra.variableManager.safelyRemoveWhiteSpace(variableValue);
                }

                data.variable = _extra.variableManager.parse.string(variableValue, customType, true);

                return string;

            }

        }
    };

    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    //////////////////// Global Interface
    ////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////
    _extra.variableManager.parse = {

        "string":function (string, customType, preventRecursion) {

            var data = {
                "value": string,
                "isNumber": !_extra.w.isNaN(string),
                "isString": false
            };

            if (data.isNumber) {

                string = subParsers.string.number(string, data);

            } else if (string) {

                string = subParsers.string.string(string, data, customType);

            } else {

                string = subParsers.string.null(string, data);

            }


            // Check variable data
            if (data.isVariable && !preventRecursion) {

                string = subParsers.string.variable(string, data, customType);

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
