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

        "mode": false,

        "log":function (message) {

            if (_extra.console) {

                _extra.console.log(message);

            }

        },
        "error":function (message) {

            var errorNumber;

            // If we have been given an error message, then we extract the error message from error bank.
            if (_extra.debugging.errors && _extra.debugging.errors[message]) {

                // Remove the message parameter from the arguments, so we can send the rest of it on to the error.
                var args = Array.prototype.slice.call(arguments);
                args.splice(0,1);

                errorNumber = message;

                          // The error code
                message = _extra.debugging.errors[message].apply(this,args);

            }


            if (_extra.preferences && _extra.preferences.debugMode) {

                message = "<div id='cpextra-alert-thinner' style='padding-right: 20px;'>" + message + "</div>";
                // If this is an official error
                if (errorNumber) {

                    _extra.w.alert(message, "CpExtra encountered error: <b>" + errorNumber + "</b>");

                } else {

                    _extra.w.alert(message, "CpExtra says...");

                }

            } else if (_extra.console) {

                _extra.console.error(message);

            }

        }

    };


    // These assignments ensure that we don't get a freed script error in Edge or IE when we send a
    // logging message.
    _extra.log = _extra.debugging.log;
    _extra.error = _extra.debugging.error;

});