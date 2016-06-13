/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 6/06/16
 * Time: 1:11 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("doubleDidgitPreferences", ["preferenceManager"], function () {

    "use strict";

    _extra.preferences.doubleDidgits = {
        "ProjectTotalHours": false,
        "ProjectTotalMinutes": false,
        "ProjectTotalSeconds": true,
        "ProjectElapsedHours":false,
        "ProjectElapsedMinutes":false,
        "ProjectElapsedSeconds":true
    };

    function registerDoubleDidgitPreference(details) {

        var info = {
            "suffix":details.suffix,

            "enable":function () {

            },

            "disable":function () {

            },

            // This is the method that is called whenever the variables change
            "update":function (value) {

                if (!value) {
                    value = "";
                } else {
                    // Don't want to be tricked by uppercase letters
                    value = value.toLowerCase();
                }



                var linkedVariableDetails,
                    isTermIncluded,
                    originalLinkedVariableSetting,
                    hasBeenChanged = false;

                // Loop through all the variables that relate to this sit of double didgit preferences.
                for (var i = 0; i < details.linkedVariables.length; i += 1) {

                    // Get commonly used info.
                    linkedVariableDetails = details.linkedVariables[i];
                    originalLinkedVariableSetting = _extra.preferences.doubleDidgits[linkedVariableDetails.variable];

                    // ACTUAL CHECK OF VARIABLE CONTENTS
                    isTermIncluded = value.indexOf(linkedVariableDetails.term) !== -1;

                    // If we need to change preferences...
                    if (isTermIncluded !== originalLinkedVariableSetting) {

                        // Change 'em
                        _extra.preferences.doubleDidgits[linkedVariableDetails.variable] = isTermIncluded;
                        // Make a note to call the update method later on.
                        hasBeenChanged = true;

                    }
                }

                // If there has been a change to the settings AND the update method has been created.
                if (hasBeenChanged && _extra.preferences.hasOwnProperty(details.updateMethodName)) {
                    _extra.preferences[details.updateMethodName]();
                }

                // ...And then trigger the change function

            }
        };

        // Register
        if (_extra.preferenceManager.registerPreferenceModule(details.suffix, info)) {
            info.update(_extra.variableManager.getVariableValue(info.name));
        }
    }

    registerDoubleDidgitPreference({
        "suffix":"UseDoubleDigitElapsedTimeValues",
        // We can't provide a direct link to the update method because it won't be defined until the 'timeInfoVariables'
        // module is initialized
        "updateMethodName":"calculateElapsedProjectTime",
        "linkedVariables":[
            {
                "term":"hour",
                "variable": "ProjectElapsedHours"
            },
            {
                "term":"minute",
                "variable": "ProjectElapsedMinutes"
            },
            {
                "term":"second",
                "variable": "ProjectElapsedSeconds"
            }
        ]
    });

    registerDoubleDidgitPreference({
        "suffix":"UseDoubleDigitTotalTimeValues",
        "updateMethodName":"calculateTotalProjectTime",
        "linkedVariables":[
            {
                "term":"hour",
                "variable": "ProjectTotalHours"
            },
            {
                "term":"minute",
                "variable": "ProjectTotalMinutes"
            },
            {
                "term":"second",
                "variable": "ProjectTotalSeconds"
            }
        ]
    });

    /*if (_extra.preferenceManager.registerPreferenceModule("DoubleClickDelay", preferenceModuleInfo)) {

    }*/

});