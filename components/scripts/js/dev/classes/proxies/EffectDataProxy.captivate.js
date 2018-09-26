/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 9/26/18
 * Time: 9:56 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("EffectDataProxy", [], function () {

    "use strict";

    function EffectDataProxy(data) {
        this._data = data;
    }

    EffectDataProxy.prototype = {

    };


    _extra.registerClass("EffectDataProxy", EffectDataProxy, _extra.CAPTIVATE);

}, _extra.CAPTIVATE);