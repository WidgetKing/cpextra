/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 2/11/15
 * Time: 4:03 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("actionManager",["softwareInterfacesManager"],function () {

    "use strict";

    var SUCCESS_CRITERIA = "success",
        FAILURE_CRITERIA = "failure",
        FOCUS_LOST_CRITERIA = "focuslost";

    _extra.actionManager = {

        "callActionOn": function (slideObject, criteria) {

            ///////////////////////////////////////////////////////////////////////
            /////////////// INTERPRET CRITERIA PROPERTY
            ///////////////////////////////////////////////////////////////////////

            function interpretCriteriaFromNumber(number) {
                return (number >= 1) ? SUCCESS_CRITERIA : FAILURE_CRITERIA;
            }

            switch (typeof criteria) {
                case "undefined" :
                    criteria = SUCCESS_CRITERIA;
                    break;

                case "string":

                        // If this is a string
                        if (_extra.w.isNaN(criteria)) {

                            switch (criteria.toLowerCase()) {

                                case "true":
                                case "correct":
                                case "success":
                                    criteria = SUCCESS_CRITERIA;
                                    break;

                                case "false" :
                                case "fail":
                                case "failure":
                                case "lastattempt":
                                case "last":
                                case "last_attempt":
                                    criteria = FAILURE_CRITERIA;
                                    break;

                                case "focus" :
                                case "focuslost" :
                                case "focus_lost" :
                                    criteria = FOCUS_LOST_CRITERIA;
                                    break;

                                default :
                                    _extra.error("CV010",slideObject,criteria);
                                    return;

                            }

                        // If this is a number in disguise
                        } else {
                            criteria = interpretCriteriaFromNumber(_extra.w.parseInt(criteria));
                        }

                    break;

                case "boolean":
                    if (criteria) {

                        criteria = SUCCESS_CRITERIA;

                    } else {

                        criteria = FAILURE_CRITERIA;

                    }
                    break;

                case "number":
                    criteria = interpretCriteriaFromNumber(_extra.w.parseInt(criteria));
                    break;

                default :
                    _extra.error("CV010",slideObject,criteria);
                    return;

            }


            ///////////////////////////////////////////////////////////////////////
            /////////////// CALL ACTION
            ///////////////////////////////////////////////////////////////////////
            var data = _extra.dataManager.getSlideObjectDataByName(slideObject),
                stringCode;

            if (data) {

                if (data.isInteractiveObject) {

                    switch (criteria) {
                        case SUCCESS_CRITERIA :
                                stringCode = data.successAction;
                            break;

                        case FAILURE_CRITERIA:
                                stringCode = data.failureAction;
                            break;

                        case FOCUS_LOST_CRITERIA:

                                if (data.focusLostAction) {

                                    stringCode = data.focusLostAction;

                                } else {
                                    _extra.error("CV011", slideObject);
                                }
                            break;

                        default :
                            break;
                    }

                } else {

                    _extra.error("CV012", slideObject);

                }

            } else {

                _extra.error("CV013", slideObject);

            }

            // If by the end of this we have some valid javascript to call
            if (stringCode) {

                _extra.captivate.movie.executeAction(stringCode);

            }
        }

    };

}, _extra.CAPTIVATE);