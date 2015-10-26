/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 4:24 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("registerStateMetaData",["slideObjectManager_global", "SlideObjectStateManager", "slideManager_global"], function () {

    "use strict";

    var stateManagers = {},
        ROLLOVER = "r",
        MOUSEDOWN = "d",
        NORMAL = "n";

    _extra.slideObjects.states = {

        ///////////////////////////////////////////////////////////////////////
        /////////////// Register States for Automatic Switching
        ///////////////////////////////////////////////////////////////////////
        registerStateMetaData: function (slideObjectName, data) {

            var slideObjectProxy,
                currentSlideID = _extra.slideManager.currentSlideID,
                currentSlideStateManagers;

            // If this is the first slide object to be registering for the current slide
            if (!stateManagers[currentSlideID]) {
                stateManagers[currentSlideID] = {};
            }
            currentSlideStateManagers = stateManagers[currentSlideID];

            // If we have already details about this object here, then something has gone wrong.
            if (currentSlideStateManagers[slideObjectName]) {
                throw new Error("At _extra.slideObjects.states.registerStateMetaData, tried to register data for '" + slideObjectName + "' twice. " +
                "Has unloading of this data from a previous slide been unsuccessful?");

            }


            slideObjectProxy = _extra.slideObjects.getSlideObjectByName(slideObjectName);
            currentSlideStateManagers[slideObjectName] = new _extra.classes.SlideObjectStateManager(slideObjectProxy, data);
        },
        "isAutomaticallyChangingStates":function (comparisonName) {

            var slideManager,
                slideID,
                slideObjectName;

            for (slideID in stateManagers) {
                if (stateManagers.hasOwnProperty(slideID)) {

                    slideManager = stateManagers[slideID];

                    for (slideObjectName in slideManager) {
                        if (slideManager.hasOwnProperty(slideObjectName)) {

                            if (slideObjectName === comparisonName) {
                                return true;
                            }

                        }
                    }

                }
            }

            return false;

        }
    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// Unload State Managers From Previous Slides
    ///////////////////////////////////////////////////////////////////////

    _extra.slideManager.enterSlideCallback.addCallback("*", function (currentSlideID) {
        var slideManager,
            slideID,
            slideObjectName;

        for (slideID in stateManagers) {

            // If we are moving into state managers for a slide which is not the current slide...
            if (stateManagers.hasOwnProperty(slideID) && slideID !== currentSlideID) {

                slideManager = stateManagers[slideID];

                // Then we'll want to unload these state managers
                for (slideObjectName in slideManager) {
                    if (slideManager.hasOwnProperty(slideObjectName)) {

                        slideManager[slideObjectName].unload();

                    }
                }

                // Remove this information so we don't have to loop through it next slide.
                delete stateManagers[slideID];
            }
        }
    });



    ///////////////////////////////////////////////////////////////////////
    /////////////// Parse State Names
    ///////////////////////////////////////////////////////////////////////
    _extra.slideObjects.enteredSlideChildObjectsCallbacks.addCallback("*", function (slideObjectName) {

        // TODO: Unload the stateManagers from the previous slide.

        // This function is sent the name of every slide object on the current slide, one by one.
        // It will analyse its states to see if there are any that interact with extra.
        var data = _extra.dataManager.getSlideObjectDataByName(slideObjectName),
            stateName,
            splitStateName,
            slideObjectMetaData = {},
            result;


        function detectIfMouseEvent(event){
            switch (event.toLowerCase()) {
                case "down":
                case "mousedown":
                    return MOUSEDOWN;


                case "rollover":
                case "over":
                case "mouseover":
                    return ROLLOVER;

                // Not a mouse event
                default :
                    return null;
            }
        }

        function getMouseEvent(splitName) {
            // check to see if the first section of the state name (x_MYVARIABLE_down) is a mouse evenet.
            result = detectIfMouseEvent(splitName[0]);

            if (result) {
                // Remove the mouse index
                splitName.shift();

                // If we have not found an event AND the last index is not the first index.
            } else if (splitName.length > 1) {
                result = detectIfMouseEvent(splitName[splitName.length - 1]);

                if (result) {
                    // Remove the last index
                    splitName.length -= 1;
                }
            }

            if (result) {
                return result;
            } else {
                return NORMAL;
            }
        }

        function getVariablesData(splitName, fullName) {
            var variableData = {},
                previousIndexVariable = false,
                segment;

            // There are multiple places in the loop below where we might want to register a variable, so we abstract
            // that functionality into a function.
            function registerVariable(variableName) {

                // x_var_var
                if (variableData.hasOwnProperty(variableName)) {

                    throw new Error("State name '" + fullName + "' illegally tried to register '" + variableName + "' twice.");

                } else {

                    variableData[variableName] = null;

                }

            }

            // Turn strings into Booleans
            function validateVariableValue(value) {
                switch (value.toLowerCase()) {
                    case "true":
                        return true;

                    case "false":
                        return false;

                    default :
                        return value;
                }
            }


            ////////////////////////////////
            ////////// Begin looping through the state names.
            for (var i = 0; i < splitName.length; i += 1) {

                segment = splitName[i];

                if (previousIndexVariable) {

                    if(isNaN(segment)) {

                        // x_var1_var2
                        if (_extra.variableManager.hasVariable(segment)) {

                            registerVariable(segment);

                            previousIndexVariable = segment;

                        // x_var1_value
                        } else {
                            variableData[previousIndexVariable] = validateVariableValue(segment);
                            previousIndexVariable = null;
                        }

                        // x_var_1
                    } else {

                        variableData[previousIndexVariable] = parseInt(segment);
                        previousIndexVariable = null;

                    }

                } else {

                    // x_var
                    if (_extra.variableManager.hasVariable(segment)) {
                        registerVariable(segment);
                    // x_invalidVar
                    } else {
                        throw new Error("Could not find variable by the name of '" + segment + "' as present in state name: '" + fullName + "'");
                    }

                    // If the previous index was a value, then this index MUST be a variable.
                    previousIndexVariable = segment;
                }


            }

            if (Object.keys(variableData).length <= 0) {
                return null;
            }

            return variableData;
        }










        for (var i = 0; i < data.states.length; i += 1) {
            stateName = data.states[i];

            if (stateName.substr(0,2).toLowerCase() === "x_") {

                // The following comments assume that the state name is: x_myvariable_down
                splitStateName = stateName.split("_");
                splitStateName.shift(); // Remove the first index which is 'x' anyway.

                result = getMouseEvent(splitStateName);
                if (!slideObjectMetaData[result]) {
                    slideObjectMetaData[result] = {};
                }

                slideObjectMetaData[result][stateName] = getVariablesData(splitStateName, stateName);

            }
        }

        if (Object.keys(slideObjectMetaData).length > 0) {
            // If this variable has a value, it means we must have run across a valid method at some point.
            // Therefore, we register the meta data.
            _extra.slideObjects.states.registerStateMetaData(slideObjectName, slideObjectMetaData);
        }

    });

});