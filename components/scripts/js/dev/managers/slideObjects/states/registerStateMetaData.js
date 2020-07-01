/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 20/10/15
 * Time: 4:24 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("registerStateMetaData",["slideObjectManager_global", "SlideObjectStateManager", "slideManager_global","stateManager_software"], function () {

    "use strict";

    var stateManagers = {},
        ROLLOVER = "r",
        MOUSEDOWN = "d",
        NORMAL = "n";

    ///////////////////////////////////////////////////////////////////////
    /////////////// UTIL MEHTODS
    ///////////////////////////////////////////////////////////////////////
    _extra.slideObjects.states.doesSlideObjectHaveDownState = function(name) {

        var slideObjects = stateManagers[_extra.slideManager.currentSlideID],
            slideObject;

        if (slideObjects) {

            slideObject = slideObjects[name];

            if (slideObject) {

                return slideObject.data.hasOwnProperty("d");

            }

        }

        return false;

    };

    ///////////////////////////////////////////////////////////////////////
    /////////////// Register States for Automatic Switching
    ///////////////////////////////////////////////////////////////////////
    _extra.slideObjects.states.registerStateMetaData = function (slideObjectName, data) {

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

            _extra.error("AS003", slideObjectName);

        }

        slideObjectProxy = _extra.slideObjects.getSlideObjectByName(slideObjectName);

        if (slideObjectProxy) {
            currentSlideStateManagers[slideObjectName] = new _extra.classes.SlideObjectStateManager(slideObjectProxy, data);
        } else {
            _extra.error("Could not find slideObjectProxy for '" + slideObjectName + "' in the registerStateMetaData module.")
        }


    };


    _extra.slideObjects.states.isAutomaticallyChangingStates = function (comparisonName) {

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

                case "normal":
                    // Although the default case of returning 'null' will eventually be turned to NORMAL anyway,
                    // We have to return NORMAL here so that the 'normal' keyword is removed from the splitName array in getMouseEvent().
                    return NORMAL;

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
                previousIndexKeyword = false,
                potentialVariableName,
                segment;

            // There are multiple places in the loop below where we might want to register a variable, so we abstract
            // that functionality into a function.
            function registerVariable(variableName) {

                // x_var_var - (Illegally using the same variable name twice)
                if (variableData.hasOwnProperty(variableName)) {

                    _extra.error("AS002", slideObjectName, fullName, variableName);

                } else {

                    variableData[variableName] = null;

                }

            }

            // Turn strings into Booleans
            function validateVariableValue(value, ignoreKeywords) {

                // Check if number
                if (!_extra.w.isNaN(value)) {
                    return _extra.w.parseInt(value);
                }


                // Check if boolean
                switch (value.toLowerCase()) {
                    case "true":
                        return true;

                    case "false":
                        return false;

                }

                // Check if Keyword
                if (!ignoreKeywords) {

                    switch (value.toLowerCase()) {
                        case "not":
                            value =  {
                                "modifier":"!"
                            };
                            break;

                        case "gt":
                            value =  {
                                "modifier":">"
                            };
                            break;

                        case "lt":
                            value =  {
                                "modifier":"<"
                            };
                            break;

                        case "gte":
                            value =  {
                                "modifier":">="
                            };
                            break;

                        case "lte":
                            value =  {
                                "modifier":"<="
                            };
                            break;

                    }

                    // Set up next loop to extra the variable's value;
                    if (typeof value === "object") {
                        previousIndexKeyword = previousIndexVariable;
                    }

                }

                return value;
            }


            ////////////////////////////////
            ////////// Begin looping through the state names.

            // x_var_ls_variable_name
            // Currently the above format is not supported as I can't think of a way to confirm that
            // 'ls' is part of a a variable name and not the value that 'var' should be set to.
            for (var i = 0; i < splitName.length; i += 1) {

                segment = splitName[i];

                if (previousIndexKeyword) {

                    variableData[previousIndexKeyword].value = validateVariableValue(segment, true);
                    previousIndexKeyword = false;


                } else if (previousIndexVariable) {

                    //if(_extra.w.isNaN(segment)) {

                        // x_var1_var2
                        if (_extra.variableManager.hasVariable(segment)) {

                            registerVariable(segment);

                            previousIndexVariable = segment;

                        // x_var1_value OR
                        // x_var_1 OR
                        // x_var_KEYWORD (NOT, GT, LT, GTE, LTE)
                        } else {
                            variableData[previousIndexVariable] = validateVariableValue(segment);
                            previousIndexVariable = null;
                        }

                    // x_var_1
                    /*} else {

                        variableData[previousIndexVariable] = _extra.w.parseInt(segment);
                        previousIndexVariable = null;

                    }*/

                } else {

                    // If we have been dealing with a variable name that has underscores, then we may have been
                    // building up the variable's name in the potentialVariableName
                    if (potentialVariableName) {
                        segment = potentialVariableName + "_" + segment;
                        potentialVariableName = null;
                    }
                    // x_var
                    if (_extra.variableManager.hasVariable(segment)) {
                        registerVariable(segment);
                        // If the previous index was a value, then this index MUST be a variable.
                        previousIndexVariable = segment;

                    // x_invalidVar OR x_var_name
                    } else {

                        // x_invalidVar
                        if (i >= splitName.length - 1) {
                            _extra.error("AS001",slideObjectName, fullName, segment);
                            /*_extra.error("Unable to find a variable named: '" + segment +
                                         "' while analysing the state named: '" + fullName + "' on the slide object named: '" + slideObjectName +
                                         "'.<br/>To correct this issue, ensure the variable and state names match.");*/
                        // x_var_name
                        } else {
                            // We have yet to reach the end of the array, so there's still potential this is an invalid
                            // name, but for the moment we'll assume we're working with a variable name with
                            // underscores.
                            potentialVariableName = segment;
                        }
                    }


                }


            }

            if (_extra.w.Object.keys(variableData).length <= 0) {
                return null;
            }

            // This means: x_var_not
            // Should cause an error, because a value shout be placed after: not
            if (previousIndexKeyword) {
                _extra.error("AS004", slideObjectName, fullName, segment);
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

        if (_extra.w.Object.keys(slideObjectMetaData).length > 0) {
            // If this variable has a value, it means we must have run across a valid method at some point.
            // Therefore, we register the meta data.
            _extra.slideObjects.states.registerStateMetaData(slideObjectName, slideObjectMetaData);
        }


    });

});
