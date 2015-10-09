/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/10/15
 * Time: 2:36 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("dataTypeConverters",["globalSlideObjectTypes"], function () {

    "use strict";

    /*
        submitted for your interest.
        This data should be gradually migrated into the function bellow.
        var captivateSlideObjectTypes = {
            "CLOSE_PATH":4,
            "CLICK_BOX":13,
            "HIGHLIGHT_BOX":14,
            "CAPTION":19,
            "TEXT_ENTRY_BOX":24, // Implemented
            "TEXT_ENTRY_BOX_SUBMIT_BUTTON":75,
            "BUTTON":177
        };
         */

    _extra.dataTypes.convertSlideObjectType = function (cpType) {

        var soTypes = _extra.dataTypes.slideObjects;

        switch (cpType) {
            case 24 :
                return soTypes.TEXT_ENTRY_BOX;

            default :
                return soTypes.UNKNOWN;
        }
    };

}, _extra.CAPTIVATE);