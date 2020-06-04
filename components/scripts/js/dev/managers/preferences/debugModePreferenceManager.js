/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/11/15
 * Time: 9:42 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("debugModePreferenceManager", ["preferenceManager", "debuggingManager"], function () {

    "use strict";

    var preferenceModuleInfo = {

        "enable":function () {
            _extra.preferences.debugMode = true;
        },

        "disable":function () {
            _extra.preferences.debugMode = false;
        }

    };

    if (!_extra.preferenceManager.registerPreferenceModule("DebugMode", preferenceModuleInfo)) {

        // If we are here, the variable has not been set, so we'll create a default value
        preferenceModuleInfo.enable();


    } else if (!preferenceModuleInfo.enabled) {

        // If we are here, the variable has been set, but the preference manager does not automatically call the
        // disable method.
        preferenceModuleInfo.disable();

    }

});
