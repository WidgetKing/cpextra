/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 30/09/15
 * Time: 5:28 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("WebObjectDataProxy", ["BaseSlideObjectDataProxy"], function () {
    "use strict";

    function WebObjectDataProxy(name, data, type) {

        // Call super constructor
        _extra.classes.BaseSlideObjectDataProxy.call(this, name, data, type);

    }


    _extra.registerClass("WebObjectDataProxy", WebObjectDataProxy, "BaseSlideObjectDataProxy", _extra.CAPTIVATE);

    _extra.w.Object.defineProperty(WebObjectDataProxy.prototype,"url", {
        get: function() {
            return this._data.container.wou;
        }
    });

    _extra.w.Object.defineProperty(WebObjectDataProxy.prototype, "isCrossOrigin", {
        get: function() {
            return this.url.indexOf("http") >= 0;
        }
    });


    _extra.w.Object.defineProperty(WebObjectDataProxy.prototype, "isSVG", {
        get: function() {
            return this.url.indexOf(".svg") >= 0;
        }
    });

}, _extra.CAPTIVATE);
