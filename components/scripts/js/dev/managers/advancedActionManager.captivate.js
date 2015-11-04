/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/11/15
 * Time: 4:03 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("advancedActionManager",["softwareInterfacesManager"],function () {

    "use strict";

    _extra.advancedActionManager = {

        "callActionOn": function (slideObject, callSuccessAction) {

            if (callSuccessAction === undefined) {

                callSuccessAction = true;

            // Interpret callSuccessAction
            } else if (typeof callSuccessAction === "string") {

                // If this is a string
                if (isNaN(callSuccessAction)) {

                    switch (callSuccessAction.toLowerCase()) {

                        case "success":
                            callSuccessAction = true;
                            break;

                        case "fail":
                        case "failure":
                            callSuccessAction = false;
                            break;

                        default :
                            _extra.error("Failed to call action on '" + slideObject + "' because can't interpret what critera '" +
                                         callSuccessAction + "' represents.");
                            return;

                    }

                // If this is a number in disguise
                } else {
                    callSuccessAction = parseInt(callSuccessAction);
                }


            }

            var data = _extra.dataManager.getSlideObjectDataByName(slideObject),
                stringCode;

            if (data && data.isInteractiveObject) {

                if (callSuccessAction) {

                    stringCode = data.successAction;

                } else {

                    stringCode = data.failureAction;

                }

            }

            // If by the end of this we have some valid javascript to call
            if (stringCode) {

                _extra.captivate.movie.executeAction(stringCode);

            }
        }

    };

}, _extra.CAPTIVATE);