/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 10/6/17
 * Time: 3:50 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("xprefAcceptNumberPad", ["variableManager"], function () {

    "use strict";

    _extra.addHookAfter(_extra.w.cp, "vTEB", function (a) {
        _extra.log(a);
    });

    /*function keyTransposer(e) {

        switch (e.keyCode) {

            // Numberpad 6
            case 102:
                e.keyCode = 54;
                break;

        }

        _extra.log(e.keyCode);

    }
    _extra.addHookAfter(_extra.captivate.keyManager, "handleKeyDown", keyTransposer);
    _extra.addHookAfter(_extra.captivate.keyManager, "handleKeyUp", keyTransposer);*/

}, _extra.CAPTIVATE);