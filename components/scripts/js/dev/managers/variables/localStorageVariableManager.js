/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 12:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("localStorageManager", ["variableManager"], function () {

    "use strict";


    var storageVariables;

    // When storage variables are saved is decided by the xprefSaveLocalStorage variable, whose behaviour is
    // managed by dev/managers/preferences/localStorageVariableManager.js
    _extra.variableManager.saveStorageVariables = function () {

        var storageVariableInfo,
            variableName;

        for (variableName in storageVariables) {

            if (storageVariables.hasOwnProperty(variableName)) {

                storageVariableInfo = storageVariables[variableName];
                storageVariableInfo.storage.setItem(variableName,
                                                    _extra.variableManager.getVariableValue(variableName));

            }

        }

    };

    function initializeStorageVariables() {
        storageVariables = {};
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
            if (!_extra.w.isNaN(storageValue)) {
                storageValue = _extra.w.parseFloat(storageValue);
            }



            // We do have a valid value in storage
            _extra.variableManager.setVariableValue(variableName, storageValue);
        }

        // Save this variable to our records so that we can save its value to storage at the appropriate time.
        storageVariables[variableName] = {
            "storage": storage
        };
    }

    // Tap into the variable manager's callbacks. This is how we are notified of variables.
    _extra.variableManager.prefixCallback.addCallback("ls", function (variableName) {
        setUpStorageVariable(variableName, _extra.w.localStorage);
    });

    _extra.variableManager.prefixCallback.addCallback("ss", function (variableName) {
        setUpStorageVariable(variableName, _extra.w.sessionStorage);
    });
});