/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 24/11/15
 * Time: 11:13 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("MouseEventByPasser", function () {

    "use strict";

    // This module assumes the browser is IE
    // There is some really detailed code over here about how to do this:
    // https://code.google.com/p/ext-ux-datadrop/source/browse/trunk/src/Override.js

    function MouseEventByPasser(slideObject) {

        /*function prevent(event) {
            var x = event.x,
                y = event.y,
                defaultDisplay = event.target.style.display,
                nextTarget;

            _extra.log(event.target);
            event.preventDefault();
            event.stopImmediatePropagation();

            event.target.style.display = "none";

            nextTarget = _extra.w.document.elementFromPoint(x,y);
            nextTarget.addEventListener("mousedown", function () {console.error("YEAH!");});

            event.target.style.display = defaultDisplay;

            nextTarget.fireEvent("onmousedown");// + event.type.toLowerCase());

            _extra.log(nextTarget);
        }

        slideObject.addEventListener("mousedown", prevent);*/

    }

    _extra.registerClass("MouseEventByPasser", MouseEventByPasser);


});