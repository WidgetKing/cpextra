/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 17/11/15
 * Time: 9:33 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("debuggingManager", function () {

    "use strict";

    _extra.debugging = {

        "log":function (message) {

            if (_extra.console) {

                _extra.console.log(message);

            }

        },
        "error":function (message) {

            // If we have been given an error message, then we extra the error message from error bank.
            if (_extra.debugging.errors && _extra.debugging.errors[message]) {

                // Remove the message parameter from the arguments, so we can send the rest of it on to the error.
                var args = Array.prototype.slice.call(arguments);
                args.splice(0,1);

                          // The error code
                message = "CpExtra encountered error: " + message +
                          // The error message
                          "<br/>" + _extra.debugging.errors[message].apply(this,args);

            }


            if (_extra.preferences && _extra.preferences.debugMode) {

                _extra.w.alert("<div style='padding-right: 20px;'>" + message + "</div>");

            } else if (_extra.console) {

                _extra.console.error(message);

            }

        }

    };

});