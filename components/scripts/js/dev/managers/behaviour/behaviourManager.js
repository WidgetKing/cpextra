/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/10/15
 * Time: 5:06 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("behaviourManager", ["generalVariableManager"], function () {

    "use strict";
    var behaviourVariablePrefix = "xbehavior";
    var behaviourModules = {};


    _extra.behaviourManager = {

        /**
         * Takes information for a behaviour module and enables it at the appropriate time.
         *
         * A behaviour module is a part of Extra which has been built to change the default behaviour of the target software.
         *
         * Examples include, stopping TextEntryBoxes from being blank when they first appear, thereby preventing their variables
         * from losing their values needlessly.
         * @param behaviourVariableSuffix
         * @param behaviourInfo
         * @returns {boolean}
         */
            "registerBehaviourModule": function (behaviourVariableSuffix, behaviourInfo) {

            // What the name for the variable that manages this behaviour should look like.
            var behaviourVariable = behaviourVariablePrefix + behaviourVariableSuffix;

            function onBehaviourVariableChange () {

                if (_extra.variableManager.getVariableValue(behaviourVariable)) {

                    if (!behaviourInfo.enabled) {
                        behaviourInfo.enable();
                        behaviourInfo.enabled = true;
                    }

                } else {

                    if (behaviourInfo.enabled) {
                        behaviourInfo.disable();
                        behaviourInfo.enabled = false;
                    }

                }
            }

            // Now check to see if a variable has been defined to manage this behaviour. If it has, then we will save this
            // behaviour.

            if (!_extra.variableManager.hasVariable(behaviourVariable)) {
                // Check to see if the behaviour variable has been defined with an underscore at the front of its name.
                behaviourVariable = "_" + behaviourVariable;
                if (!_extra.variableManager.hasVariable(behaviourVariable)) {
                    // Show the behaviour module that there is no variable defined to manage the behaviour and it is therefore
                    // unneccesary to instantiate.
                    return false;
                }
            }


            // Check validity of passed in information.
            if (behaviourModules[behaviourVariable]) {
                // We already have a behaviour module of this type.
                throw new Error("Illegally attempted to register two behaviour modules with the name: " + behaviourVariableSuffix);
            } else if (!behaviourInfo.enable) {
                throw new Error("Illegally tried to submit a behaviour module without an enable method specified in the behaviourInfo parameter object.");
            } else if (!behaviourInfo.disable) {
                throw new Error("Illegally tried to submit a behaviour module without a disable method specified in the behaviourInfo parameter object.");
            }

            // Save behaviour
            behaviourModules[behaviourVariable] = behaviourInfo;
            behaviourInfo.enabled = false;



            // Every time the behaviour variable changes, we'll make sure the module is enabled or disabled accordingly.
            _extra.variableManager.listenForVariableChange(behaviourVariable, onBehaviourVariableChange);

            // We'll also enable or disable
            onBehaviourVariableChange();

            // Let the module know there is a variable set up to manage the behaviour and it is therefore approved to
            // continue instantiation
            return true;

        }
    };

});