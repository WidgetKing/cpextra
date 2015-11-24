/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 5:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("TextEntryBoxDataProxy", ["BaseSlideObjectDataProxy"], function () {
    "use strict";

    function TextEntryBoxDataProxy(name, data, type) {

        // Call super constructor
        _extra.classes.BaseSlideObjectDataProxy.call(this, name, data, type);

        this._isResponsive = typeof data.container.txt === "object";
    }


    _extra.registerClass("TextEntryBoxDataProxy", TextEntryBoxDataProxy, "BaseSlideObjectDataProxy", _extra.CAPTIVATE);

    _extra.w.Object.defineProperty(TextEntryBoxDataProxy.prototype,"variable", {
        get: function() {
            return this._data.base.vn;
        }
    });

    _extra.w.Object.defineProperty(TextEntryBoxDataProxy.prototype,"focusLostAction", {
        get: function() {
            return this._data.base.ofla;
        }
    });

    _extra.w.Object.defineProperty(TextEntryBoxDataProxy.prototype,"defaultText", {
        get: function() {
            if (this._isResponsive) {
                return this._data.container.txt[_extra.captivate.getResponsiveProjectWidth()];
                //_extra.error("TextEntryBoxData.defaultText getter for Captivate responsive projects has yet to be implemented");
                //return null;
            } else {
                return this._data.container.txt;
            }
        },
        set: function(value) {

            // In responsive projects this property will be set as an object to allow different default text according ot screen size.
            if (this._isResponsive) {
                for (var screenSize in this._data.container.txt) {
                    // Go through all the screen sizes and change its default value.
                    if (this._data.container.txt.hasOwnProperty(screenSize)) {
                        this._data.container.txt[screenSize] = value;
                    }
                }
            } else {
                // In a non responsive project this is much more direct.
                this._data.container.txt = value;
            }
        }
    });


}, _extra.CAPTIVATE);