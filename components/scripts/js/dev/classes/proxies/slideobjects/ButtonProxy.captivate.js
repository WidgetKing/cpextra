/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 8/24/18
 * Time: 8:27 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("ButtonProxy", ["BaseSlideObjectProxy"], function () {

    "use strict";

    function ButtonProxy (element, data) {
        // Call super constructor
        _extra.classes.BaseSlideObjectProxy.call(this, element, data);
    }

    _extra.registerClass("ButtonProxy", ButtonProxy, "BaseSlideObjectProxy", _extra.CAPTIVATE);

    ButtonProxy.prototype.onSlideObjectInitialized = function () {

        this._focusDiv = _extra.w.document.body;

        // Super!
        ButtonProxy.superClass.onSlideObjectInitialized.call(this);

    };

}, _extra.CAPTIVATE);