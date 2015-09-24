/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 12:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.initComponent(function () {

    "use strict";

    var storageVariables;

    function saveStorageVariables() {
        var storageVariableInfo,
            variableName;

        for (variableName in storageVariables) {

            if (storageVariables.hasOwnProperty(variableName)) {

                storageVariableInfo = storageVariables[variableName];
                storageVariableInfo.storage.setItem(variableName,
                                                    _extra.X.getVariableValue(variableName));

            }

        }

    }

    function initializeStorageVariables() {
        storageVariables = {};

        // Save the storage variables when the window closes.
        _extra.w.addEventListener("unload", saveStorageVariables);
    }



    function setUpStorageVariable(variableName, storage) {

        // Initialize Storage Variables
        if (!storageVariables) {
            initializeStorageVariables();
        }

        // Check Storage
        var storageValue = storage.getItem(variableName);
        if (storageValue) {

            // If this item can be of a number type, then write it to the variable as a number type.
            if (!isNaN(storageValue)) {
                storageValue = parseFloat(storageValue);
            }



            // We do have a valid value in storage
            _extra.X.setVariableValue(variableName, storageValue);
        }

        // Save this variable to our records so that we can save its value to storage at the appropriate time.
        storageVariables[variableName] = {
            "storage": storage
        };
    }

    setTimeout(saveStorageVariables,4000);

    // Tap into the variable manager's callbacks. This is how we are notified of variables.
    _extra.variableManager.registerVariablePrefixCallback("ls", function (variableName) {
        setUpStorageVariable(variableName, _extra.w.localStorage);
    });

    _extra.variableManager.registerVariablePrefixCallback("ss", function (variableName) {
        setUpStorageVariable(variableName, _extra.w.sessionStorage);
    });
});