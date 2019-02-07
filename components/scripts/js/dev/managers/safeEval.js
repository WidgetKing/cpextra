/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/7/19
 * Time: 10:37 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("safeEval", function () {

    "use strict";

    var initializedIDs = {};

    /**
     * This method is used by CpMate to execute custom code
     * in the Captivate window context.
     * @param code A string of code to be processed by window.eval()
     * @param id An optional ID that identifies the string of code. Once code matching one ID has been called, another attempt to call code matching that ID will fail. This is to stop duplication of code.
     */
    _extra.safeEval = function (code, id) {

        if (id !== undefined) {

            if (initializedIDs.hasOwnProperty(id)) {

                return;

            } else {

                initializedIDs[id] = true;

            }

        }

        _extra.w.eval(code);

    };

});