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

    // Function which is called when the movies has been loaded
    return function () {

        var captivateVariables = _extra.cp.variablesManager.varInfos;

        for (var variableName in captivateVariables) {
            if (captivateVariables.hasOwnProperty(variableName)) {
                _extra.X.log(variableName);
            }
        }

        _extra.X.log("HERE3");
    };
});