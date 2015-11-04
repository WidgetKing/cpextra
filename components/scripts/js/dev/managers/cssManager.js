/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/10/15
 * Time: 5:19 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("cssManager", function () {

    "use strict";

    ///////////////////////////////////////////////////////////////////////
    /////////////// Create Extra's Styles
    ///////////////////////////////////////////////////////////////////////
    _extra.$("<style type='text/css'> .extra-mouse-disabled{ pointer-events: none; };</style>").appendTo("head");
    _extra.$("<style type='text/css'> .extra-hand-cursor{ cursor:pointer;  };</style>").appendTo("head");

    ///////////////////////////////////////////////////////////////////////
    /////////////// Create Methods
    ///////////////////////////////////////////////////////////////////////
    _extra.cssManager = {
        "addClassTo":function (element, className) {
            _extra.$(element).addClass(className);
        },
        "removeClassFrom":function (element, className) {
            _extra.$(element).removeClass(className);
        },
        "editCSSOn":function (element, property, value) {
            _extra.$(element).css(property, value);
        }
    };
});