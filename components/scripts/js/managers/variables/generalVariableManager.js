/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 23/09/15
 * Time: 9:02 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.initComponent(function () {
    "use strict";

    //////////////////////////
    /////// Private Variables
    //////////////////////////
    var variablePrefixCallbacks = {};


    //////////////////////////
    ////// Component Setup
    //////////////////////////
    window._extra.variableManager = {};
    window._extra.variableManager.registerVariablePrefixCallback = function (prefix, callback) {

        if (!variablePrefixCallbacks[prefix]) {
            variablePrefixCallbacks[prefix] = [];
        }

        variablePrefixCallbacks[prefix].push(callback);
    };

    ///////////////////////////
    //////// Public Methods
    ///////////////////////////
    /**
     * Changes the value of a Captivate Variable. This is the safest method of doing this, as Captivate Extra tickers
     * a lot with variables, it wants to know in advance when they are changed. This function will ensure they are
     * always updated in an acceptable manner.
     * @param variableName The name of the variable to be updated
     * @param value The value to assign said variable
     */
    _extra.X.setVariableValue = function (variableName, value) {
        _extra.X.cpInterface.setVariableValue(variableName, value);
    };

    /**
     * Gives you the value of a Captivate Variable. This is the safest method of doing this, as Captivate Extra tickers
     * a lot with variables behind the scenes. Captivate Extra wants to be notified whenever a variable is accessed.
     * This function will ensure the correct value is returned.
     * @param variableName The name of the variable whose value you want returned
     */
    _extra.X.getVariableValue = function (variableName) {
        return _extra.X.cpInterface.getVariableValue(variableName);
    };


    // Function which is called when the movies has been loaded
    return function () {

        var captivateVariables = _extra.cp.variablesManager.varInfos,
            varInfo,
            varName,
            varNameSplitArray,
            varPrefix,
            i, j;

        for (i = 0; i < captivateVariables.length; i += 1) {

            varInfo = captivateVariables[i];

            if (!varInfo.systemDefined) {
                // This is a user variable

                varName = varInfo.name;
                varNameSplitArray = varName.split("_");
                varPrefix = varNameSplitArray[0];

                // To support all variables as having an underscore '_' in front of their name
                // we'll check if the first index is empty (as would be true in a variable name such as _ls_myVariable)
                // If so, we'll use the second index as the variable's prefix (in that example it would be 'ls')
                if (varPrefix === "") {
                    varPrefix = varNameSplitArray[1];
                }

                // If someone has added a callback for this kind of prefix.
                if (variablePrefixCallbacks[varPrefix]) {

                    // varInfo now becomes the variable to hold the array of callbacks.
                    varInfo = variablePrefixCallbacks[varPrefix];

                    // Loop through all callbacks and send them the name of the variable they want.
                    for (j = 0; j < varInfo.length; j += 1) {

                        varInfo[j](varName);

                    }

                }


            }

        } // End of looping through Captivate Variables.

        // All relevant callbacks called. We can unload this information now.
        variablePrefixCallbacks = null;

    };
});