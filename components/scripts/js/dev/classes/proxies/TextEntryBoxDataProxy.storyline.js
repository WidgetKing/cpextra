/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 6:09 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("TextEntryBoxDataProxy", ["BaseSlideObjectDataProxy"], function () {
    "use strict";

    function TextEntryBoxDataProxy(name, data, type) {
        // Call super constructor
        _extra.classes.BaseSlideObjectDataProxy.call(this, name, data, type);
    }




    _extra.registerClass("TextEntryBoxDataProxy", TextEntryBoxDataProxy,"BaseSlideObjectDataProxy", _extra.STORYLINE);

    Object.defineProperty(TextEntryBoxDataProxy.prototype,"variable", {
            get: function() {
                _extra.error("TextEntryBoxDataProxy.variable has yet to be defined!");
                return null;
            }
        });
}, _extra.STORYLINE);