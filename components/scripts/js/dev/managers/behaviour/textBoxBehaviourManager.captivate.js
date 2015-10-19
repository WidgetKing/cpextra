/*global _extra*/
/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/09/15
 * Time: 1:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("preventTextEntryBoxOverwrite", ["generalSlideObject_global", "behaviourManager", "eventManager"], function () {
    "use strict";

    ///////////////////////
    ////////// Private Variables
    ///////////////////////

    var hasCollectedTextBoxData = false,
        textEntryBoxData = {},
        areVariablesInitliazed = false,
        behaviourModuleInfo = {
            // Automatically called by _extra.behaviourManager in response to the value of the xbehaviourPreventTextEntryBoxOverwrite variable
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
        _extra.eventDispatcher.removeEventListener("variablesInitialized", onVariablesInit);
        areVariablesInitliazed = true;
        if (behaviourModuleInfo.enabled) {
            for (var textEntryBoxName in textEntryBoxData) {
                if (textEntryBoxData.hasOwnProperty(textEntryBoxName)) {
                    enableVariable(textEntryBoxName);
                }
            }
        }
    }

    _extra.eventDispatcher.addEventListener("variablesInitialized", onVariablesInit);

    ///////////////////////
    ////////// Initialization
    ///////////////////////

    if (_extra.behaviourManager.registerBehaviourModule("PreventTextEntryBoxOverwrite", behaviourModuleInfo)) {



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

}, _extra.CAPTIVATE);