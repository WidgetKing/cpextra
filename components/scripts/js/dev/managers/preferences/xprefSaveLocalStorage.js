/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 6:17 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("saveLocalStoragePreference", ["preferenceManager", "eventManager"], function () {

    "use strict";


    var info = {
        "enable": function () {

        },
        "update": function (value) {

            if (!value) {
                value = "";
            } else if (_extra.w.isNaN(value)) {
                value = value.toLowerCase();
            }

            // Stop whatever it was we were doing before.
            info.disable();

            switch (value) {

                case "onenterslide" :
                case "onslideenter" :

                        _extra.slideManager.enterSlideCallback.addCallback("*", _extra.variableManager.saveStorageVariables);
                        // Even though we're saving on every slide, to be save we also want to save on exit.
                        _extra.w.addEventListener("unload", _extra.variableManager.saveStorageVariables);

                    break;

                case "disable":
                case "disabled":
                case "off":
                case "no":

                        // Do nothing

                    break;

                case "exit" :
                case "onexit":
                        _extra.w.addEventListener("unload", _extra.variableManager.saveStorageVariables);
                    break;

                /*
                case "onvariablechange" :
                case "variablechange" :
                case "change" :
                case "onchange" :
                */
                default :
                        // We might be called here before the local storage section has had a chance to initialize.
                        // We need to detect when that will happen.
                        if (_extra.variableManager.hasParsedVariables) {

                            for (var variableName in _extra.variableManager.storageVariables) {
                                if (_extra.variableManager.storageVariables.hasOwnProperty(variableName)) {

                                    _extra.variableManager.listenForVariableChange(variableName, info.onVariableChange);

                                }
                            }

                        } else {

                            var onVariablesInitialized = function () {

                                _extra.eventManager.eventDispatcher.removeEventListener("variablesInitialized", onVariablesInitialized);
                                info.update(value);

                            };

                            _extra.eventManager.eventDispatcher.addEventListener("variablesInitialized", onVariablesInitialized);

                        }

                         // Even though we're saving on variable change, to be save we also want to save on exit.
                        _extra.w.addEventListener("unload", _extra.variableManager.saveStorageVariables);
                    break;
            }
        },
        "disable": function () {

            _extra.slideManager.enterSlideCallback.removeCallback("*", _extra.variableManager.saveStorageVariables);
            _extra.w.removeEventListener("unload", _extra.variableManager.saveStorageVariables);

            for (var variableName in _extra.variableManager.storageVariables) {
                if (_extra.variableManager.storageVariables.hasOwnProperty(variableName)) {

                    _extra.variableManager.stopListeningForVariableChange(variableName, info.onVariableChange);

                }
            }

        },
        "onVariableChange": function (event) {

            // TODO: Abstract the event object into a proxy so this code can also work in Storyline.
            _extra.variableManager.saveStorageVariable(event.Data.varName);

        }
    };

    var hasVariable = _extra.preferenceManager.registerPreferenceModule("SaveLocalStorage", info);

    if (!hasVariable) {

        // Default action
        info.enable();
        info.update("change");

    }

});