/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 9/26/18
 * Time: 9:43 PM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("SlideEffectsDataProxy", [], function () {

    "use strict";

    function SlideEffectsDataProxy(data) {
        this._data = data;
        this._animationList = data.a1;
        this._animationData = data.a2;
    }

    SlideEffectsDataProxy.prototype = {

    };

    SlideEffectsDataProxy.prototype.getEffectsFor = function (slideObjectName) {

        var effects = [];

        for (var obj in this._animationData) {
            if (this._animationData.hasOwnProperty(obj)) {

                var effectData = this._animationData[obj];

                if (effectData.a3 === slideObjectName) {
                    effects.push(new _extra.classes.EffectDataProxy(effectData));
                }

            }
        }

        return effects;

    };

    _extra.registerClass("SlideEffectsDataProxy", SlideEffectsDataProxy, _extra.CAPTIVATE);


}, _extra.CAPTIVATE);