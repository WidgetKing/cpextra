/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 29/10/15
 * Time: 10:46 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("getVariableManager", ["variableManager"] ,function () {

    "use strict";


    var getVariables;

    function cleanVariablePrefix(variableName) {
        if (variableName.substr(0,4).toLowerCase() === "get_"){

            return "get_" + variableName.substr(4,variableName.length);

        } else if (variableName.substr(0,5).toLowerCase() === "_get_") {

            return "get_" + variableName.substr(5,variableName.length);

        }
    }

    // Tap into the variable manager's callbacks. This is how we are notified of variables.
    _extra.variableManager.prefixCallback.addCallback("get", function (variableName) {

        ///////////////////////////////////////////////////////////////////////
        /////////////// Retrieve GET variables
        ///////////////////////////////////////////////////////////////////////
        if (!getVariables) {
            // Set up get variables.
            // This should only happen once, so that we don't waste cpu.

            // Get variable code comes from Andy E's comment at the site bellow.
            // http://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript
            var match,
                pl     = /\+/g,  // Regex for replacing addition symbol with a space
                search = /([^&=]+)=?([^&]*)/g,
                decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
                query  = _extra.w.document.location.search.substring(1),
                GETVariableName;

            getVariables = {};
            while ((match = search.exec(query)) !== null) {

                GETVariableName = decode(match[1]);
                // Check if the variable name lacks the 'get_' prefix
                if (GETVariableName.substr(0,4).toLowerCase() !== "get_" &&
                    GETVariableName.substr(0,5).toLowerCase() !== "_get_") {

                    GETVariableName = "get_" + GETVariableName;
                }

                // Assign to our getVariables library.
                getVariables[GETVariableName] = decode(match[2]);
            }

        }



        ///////////////////////////////////////////////////////////////////////
        /////////////// Assign GET variables to Captivate Variables
        ///////////////////////////////////////////////////////////////////////

        // Deal with capitilzation and the potential underscore '_' at the start of the name.
        var result = getVariables[cleanVariablePrefix(variableName)];

        // If this variable has not been defined
        if (result === undefined) {
            result = null;

        // If this is a number;
        } else if (!_extra.w.isNaN(result)) {
            result = _extra.w.parseFloat(result);
        }

        // Set variable value!
        if (result !== null) {
            _extra.variableManager.setVariableValue(variableName, result);
        }


        // TODO: Unload this after initialization.

    });
});