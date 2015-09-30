/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 5:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("TextEntryBoxDataProxy", ["BaseSlideObjectDataProxy"], function () {
    "use strict";

    function TextEntryBoxDataProxy(name, data) {
        // Call super constructor
        _extra.classes.BaseSlideObjectDataProxy.call(this, name, data);
    }


    _extra.registerClass("TextEntryBoxDataProxy", TextEntryBoxDataProxy,"BaseSlideObjectDataProxy", _extra.CAPTIVATE);
}, _extra.CAPTIVATE);