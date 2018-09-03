/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 19/11/15
 * Time: 3:51 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("CustomEvent", function () {

    "use strict";

    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }


    CustomEvent.prototype = Event.prototype;

    _extra.registerClass("CustomEvent", CustomEvent);


    ///////////////////////////////////////////////////////////////////////
    /////////////// ADD EVENT
    ///////////////////////////////////////////////////////////////////////

    // We put it here, because eventManager has dependencies which might cause loops.

    _extra.createEvent = function(name, params) {
        if (_extra.isIE) {

            return new _extra.classes.CustomEvent(name, params);

        } else {

            return new _extra.w.Event(name, params);

        }
    };
});