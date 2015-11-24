/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 5/11/15
 * Time: 6:17 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("saveLocalStoragePreference", ["preferenceManager"], function () {

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

                    break;

                case "disable":
                case "disabled":
                case "off":
                case "no":

                        // Do nothing

                    break;

                // TODO: Add another 'onchange' type

                default :
                        //_extra.w.addEventListener("unload", _extra.variableManager.saveStorageVariables);
                        _extra.w.addEventListener("unload", _extra.variableManager.saveStorageVariables);
                    break;
            }
        },
        "disable": function () {

            _extra.slideManager.enterSlideCallback.removeCallback("*", _extra.variableManager.saveStorageVariables);
            _extra.w.removeEventListener("unload", _extra.variableManager.saveStorageVariables);

        }
    };

    var hasVariable = _extra.preferenceManager.registerPreferenceModule("SaveLocalStorage", info);

    if (!hasVariable) {

        // Default action
        info.enable();
        info.update();

    }

});