/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/10/15
 * Time: 2:36 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("dataTypeConverters",["globalSlideObjectTypes"], function () {

    "use strict";

    _extra.dataTypes.convertSlideObjectType = function (cpType, name) {

        var soTypes = _extra.dataTypes.slideObjects;

        switch (cpType) {

            case 12 :
                return soTypes.MOUSE;

            case 14 :
                return soTypes.HIGHLIGHT_BOX;

            case 15 :
                return soTypes.IMAGE;

            case 19 :
                return soTypes.CAPTION;

            case 24 :
                return soTypes.TEXT_ENTRY_BOX;

            case 28 :
                return soTypes.ANIMATION;

            case 75 :
            case 177 :
                return soTypes.BUTTON;

            case 98 :
                return soTypes.VIDEO;

            case 99 :
                return soTypes.ZOOM_AREA;

            case 133 :
                return soTypes.WIDGET;

            case 142 :
            case 589 :
            case 612 :
            case 661 : // Success caption / shape
                return soTypes.SHAPE;

            case 652 :
                return soTypes.WEB_OBJECT;

            case 15728652:
                return soTypes.MOUSE_CLICK;

            default :
                if (cpType !== undefined) {
                    _extra.log(name + " has unknown type: " + cpType);
                }
                return soTypes.UNKNOWN;
        }
    };

}, _extra.CAPTIVATE);