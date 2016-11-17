/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 12:21 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("localStorageManager", ["variableManager", "queryManager"], function () {

    "use strict";



    ///////////////////////////////////////////////////////////////////////
    /////////////// PRIVATE VARS
    ///////////////////////////////////////////////////////////////////////
    var storageVariables,
        variablesNotToSave = {},
        storageNotToSave = {},
        LOCAL = "local",
        SESSION = "session";

    ///////////////////////////////////////////////////////////////////////
    /////////////// PRIVATE METHODS
    ///////////////////////////////////////////////////////////////////////
    function canSaveVariable(variableName, variableInfo) {
        return !variablesNotToSave.hasOwnProperty(variableName) && !storageNotToSave.hasOwnProperty(variableInfo.storageName);
    }


    ///////////////////////////////////////////////////////////////////////
    /////////////// PUBLIC METHODS
    ///////////////////////////////////////////////////////////////////////
    // When storage variables are saved is decided by the xprefSaveLocalStorage variable, whose behaviour is
    // managed by dev/managers/preferences/localStorageVariableManager.js
    _extra.variableManager.saveStorageVariables = function () {

        var variableName;

        for (variableName in storageVariables) {

            // Check if we are allowed to save this variable.
            if (storageVariables.hasOwnProperty(variableName) &&
               !variablesNotToSave.hasOwnProperty(variableName)) {

                _extra.variableManager.saveStorageVariable(variableName);

            }

        }

    };

    _extra.variableManager.saveStorageVariable = function (variableName) {

        var storageVariableInfo;

        if (storageVariables[variableName]) {

            storageVariableInfo = storageVariables[variableName];

            // Check if we are allowed to save this storage.
            if (canSaveVariable(variableName, storageVariableInfo)) {

                storageVariableInfo.storage.setItem(variableName,
                                                    _extra.variableManager.getVariableValue(variableName));

            }

        }

    };

    _extra.variableManager.flushStorage = function(variableName) {

        // If this variable exists
        if (storageVariables.hasOwnProperty(variableName)) {

            storageVariables[variableName].storage.removeItem(variableName);
            variablesNotToSave[variableName] = true;

        // If we've been given a query
        } else if (_extra.isQuery(variableName)) {

            var list = _extra.queryList(variableName, storageVariables);

            for (var i = 0; i < list.length; i += 1) {

                _extra.variableManager.flushStorage(list[i]);

            }

        // If none of the above, then we might be dealing with a speacial keyword... Or an error.
        } else {

            // Check if this could be some special characters.
            switch (variableName.toLowerCase()) {

                case "localstorage" :
                case "local" :
                        _extra.w.localStorage.clear();
                        storageNotToSave[LOCAL] = true;
                    break;

                case "sessionstorage":
                case "session" :
                        _extra.w.sessionStorage.clear();
                        storageNotToSave[SESSION] = true;
                    break;

                case "all" :
                        _extra.w.sessionStorage.clear();
                        _extra.w.localStorage.clear();
                        storageNotToSave[SESSION] = true;
                        storageNotToSave[LOCAL] = true;
                    break;

                default :
                        // Could not recognize this as anything. Error!
                        _extra.error("CV060", variableName);
                    break;
            }

        }

    };

    function initializeStorageVariables() {
        storageVariables = {};
        _extra.variableManager.storageVariables = storageVariables;
    }



    function setUpStorageVariable(variableName, storage, storageName) {

        // Initialize Storage Variables
        if (!storageVariables) {
            initializeStorageVariables();
        }


        // Check Storage
        var storageValue;

        try {

            storageValue = storage.getItem(variableName);

        } catch (e) {

            _extra.error("PV001", storageName);
            return;

        }

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
            "storage": storage,
            "storageName": storageName
        };

    }

    // Tap into the variable manager's callbacks. This is how we are notified of variables.
    _extra.variableManager.prefixCallback.addCallback("ls", function (variableName) {
        try {

            setUpStorageVariable(variableName, _extra.w.localStorage, LOCAL);

        } catch (e) {

            _extra.error("PV001", "local");

        }
    });

    _extra.variableManager.prefixCallback.addCallback("ss", function (variableName) {
        try {

            setUpStorageVariable(variableName, _extra.w.sessionStorage, SESSION);

        } catch (e) {

            _extra.error("PV001", "session");

        }
    });
});