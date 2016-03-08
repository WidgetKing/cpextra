/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("preventTextEntryBoxOverwrite", ["slideObjectManager_global", "preferenceManager", "eventManager",
                      "globalSlideObjectTypes"], function () {
    "use strict";

    function onSlideEnter(slideObjectName) {

        var data = _extra.dataManager.getSlideObjectDataByName(slideObjectName),
            slideObject = _extra.slideObjects.getSlideObjectByName(slideObjectName),
            variableValue = _extra.captivate.variableManager.getVariableValue(data.variable);

        data.defaultText = variableValue;
        slideObject.value = variableValue;

    }

    var behaviourModuleInfo = {
        "enable": function () {

            _extra.slideObjects.enteredSlideChildObjectsCallbacks.addCallback(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX, onSlideEnter);

        },
        "disable": function () {

            _extra.slideObjects.enteredSlideChildObjectsCallbacks.removeCallback(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX, onSlideEnter);

        }
    };

    _extra.preferenceManager.registerPreferenceModule("PreventTEBOverwrite", behaviourModuleInfo);


    ///////////////////////
    ////////// Private Variables
    ///////////////////////
    /*
    var hasCollectedTextBoxData = false,
            textEntryBoxData = {},
            areVariablesInitliazed = false,
            behaviourModuleInfo = {
                // Automatically called by _extra.preferenceManager in response to the value of the xbehaviourPreventTextEntryBoxOverwrite variable
            "enable": function () {
                if (hasCollectedTextBoxData) {
                    for (var textEntryBoxName in textEntryBoxData) {
                        if (textEntryBoxData.hasOwnProperty(textEntryBoxName)) {
                            enableVariable(textEntryBoxName);
                        }
                    }
                }
            },
            "disable": function () {
                if (hasCollectedTextBoxData) {
                    for (var textEntryBoxName in textEntryBoxData) {
                        if (textEntryBoxData.hasOwnProperty(textEntryBoxName)) {
                            disableVariable(textEntryBoxName);
                        }
                    }
                }
            }
        };



        ///////////////////////
        ////////// Private Functions
        ///////////////////////

        function enableVariable(textEntryBoxName) {
            var d = textEntryBoxData[textEntryBoxName];

            _extra.variableManager.listenForVariableChange(d.data.variable, d.onVariableChange);
            d.onVariableChange();
        }

        function disableVariable(textEntryBoxName) {
            var d = textEntryBoxData[textEntryBoxName];
            _extra.variableManager.stopListeningForVariableChange(d.data.variable, d.onVariableChange);
        }

        ///////////////////////
        ////////// Confirm Variable Initilization.
        ///////////////////////
        function onVariablesInit() {
            _extra.eventManager.eventDispatcher.removeEventListener("variablesInitialized", onVariablesInit);
            areVariablesInitliazed = true;
            if (behaviourModuleInfo.enabled) {
                for (var textEntryBoxName in textEntryBoxData) {
                    if (textEntryBoxData.hasOwnProperty(textEntryBoxName)) {
                        enableVariable(textEntryBoxName);
                    }
                }
            }
        }

        _extra.eventManager.eventDispatcher.addEventListener("variablesInitialized", onVariablesInit);






        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////
        //////////////////// Initialization
        ////////////////////////////////////////////////////////////////////////////////
        ////////////////////////////////////////////////////////////////////////////////

        if (_extra.preferenceManager.registerPreferenceModule("PreventTEBOverwrite", behaviourModuleInfo)) { //xprefPreventTEBOverwrite



            // The behaviour manager has approved of us being instantiated! Proceed.
            _extra.slideObjects.allObjectsOfTypeCallback.addCallback(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX, function (textEntryBoxName) {

                hasCollectedTextBoxData = true;

                // Get the data for the text entry box
                var tebData = _extra.dataManager.getSlideObjectDataByName(textEntryBoxName);

                textEntryBoxData[textEntryBoxName] = {
                    "data": tebData,
                    "onVariableChange": function () {
                        tebData.defaultText = _extra.variableManager.getVariableValue(tebData.variable);
                    }
                };

                if (behaviourModuleInfo.enabled && areVariablesInitliazed) {
                    enableVariable(textEntryBoxName);
                }

            });

        }

    */

}, _extra.CAPTIVATE);