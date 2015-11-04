/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/10/15
 * Time: 5:06 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("preferenceManager", ["variableManager"], function () {

    "use strict";
    var preferenceVariablePrefix = "xpref";
    var preferenceModules = {};


    _extra.preferenceManager = {

        /**
         * Takes information for a behaviour module and enables it at the appropriate time.
         *
         * A behaviour module is a part of Extra which has been built to change the default behaviour of the target software.
         *
         * Examples include, stopping TextEntryBoxes from being blank when they first appear, thereby preventing their variables
         * from losing their values needlessly.
         * @param preferenceVariableSuffix
         * @param preferenceInfo
         * @returns {boolean}
         */
            "registerPreferenceModule": function (preferenceVariableSuffix, preferenceInfo) {

            // What the name for the variable that manages this behaviour should look like.
            var preferenceVariable = preferenceVariablePrefix + preferenceVariableSuffix;

            function onPreferenceVariableChange () {

                if (_extra.variableManager.getVariableValue(preferenceVariable)) {

                    if (!preferenceInfo.enabled) {
                        preferenceInfo.enable();
                        preferenceInfo.enabled = true;
                    }

                } else {

                    if (preferenceInfo.enabled) {
                        preferenceInfo.disable();
                        preferenceInfo.enabled = false;
                    }

                }
            }

            // Now check to see if a variable has been defined to manage this behaviour. If it has, then we will save this
            // behaviour.

            if (!_extra.variableManager.hasVariable(preferenceVariable)) {
                // Check to see if the behaviour variable has been defined with an underscore at the front of its name.
                preferenceVariable = "_" + preferenceVariable;
                if (!_extra.variableManager.hasVariable(preferenceVariable)) {
                    // Show the behaviour module that there is no variable defined to manage the behaviour and it is therefore
                    // unneccesary to instantiate.
                    return false;
                }
            }


            // Check validity of passed in information.
            if (preferenceModules[preferenceVariable]) {
                // We already have a behaviour module of this type.
                throw new Error("Illegally attempted to register two behaviour modules with the name: " + preferenceVariableSuffix);
            } else if (!preferenceInfo.enable) {
                throw new Error("Illegally tried to submit a behaviour module without an enable method specified in the preferenceInfo parameter object.");
            } else if (!preferenceInfo.disable) {
                throw new Error("Illegally tried to submit a behaviour module without a disable method specified in the preferenceInfo parameter object.");
            }

            // Save behaviour
            preferenceModules[preferenceVariable] = preferenceInfo;
            preferenceInfo.enabled = false;



            // Every time the behaviour variable changes, we'll make sure the module is enabled or disabled accordingly.
            _extra.variableManager.listenForVariableChange(preferenceVariable, onPreferenceVariableChange);

            // We'll also enable or disable
            onPreferenceVariableChange();

            // Let the module know there is a variable set up to manage the behaviour and it is therefore approved to
            // continue instantiation
            return true;

        }
    };

});