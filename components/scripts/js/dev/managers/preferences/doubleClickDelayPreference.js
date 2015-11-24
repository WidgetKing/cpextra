/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 1:03 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("doubleClickDelayPreference", ["preferenceManager"], function () {

    "use strict";

    // This is our preference
    // And this is the default value: 0
    // 0 means that we will not listen for double click delay.
    _extra.preferences.doubleClickDelay = 0;

    var preferenceModuleInfo = {
        "enable": function () {

            // This is called only once while validated.
            // We want to update every time the function updates.
            // This function has no content, but the preference manager will throw an error if it's not defined.

        },
        "update": function (value) {

            // If we haven't been given a number.
            if (typeof value !== "number") {

                if (_extra.w.isNaN(value)) {
                    preferenceModuleInfo.disable();
                    return;
                }
                value = _extra.w.parseFloat(value);
            }

            // Assign AND convert seconds to milliseconds
            _extra.preferences.doubleClickDelay = value * 1000;

        },
        "disable": function () {
            // Turn off.
            _extra.preferences.doubleClickDelay = 0;
        }
    };

    _extra.preferenceManager.registerPreferenceModule("DoubleClickDelay", preferenceModuleInfo);

});