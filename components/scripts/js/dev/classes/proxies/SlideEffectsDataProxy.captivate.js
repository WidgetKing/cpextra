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
        get animationList () {
            return this._animationList;
        }
    };

    SlideEffectsDataProxy.prototype.getEffectsFor = function (slideObjectName) {

        var effects = [],
            that = this;

        function createEffectData(data, effectName) {

            for (var listIndex = 0; listIndex < that._animationList.length; listIndex += 1) {
                var animation = that._animationList[listIndex];

                if (animation[1] === effectName) {
                    return new _extra.classes.EffectDataProxy(data, effectName, listIndex, that);
                }

            }
            return null;
        }



        for (var name in this._animationData) {
            if (this._animationData.hasOwnProperty(name)) {

                var effectData = this._animationData[name];

                if (effectData.a3 === slideObjectName) {
                    effects.push(createEffectData(effectData, name));
                    effects.push(new _extra.classes.EffectDataProxy(effectData, name, this._animationData));
                }

            }
        }

        return effects;

    };

    _extra.registerClass("SlideEffectsDataProxy", SlideEffectsDataProxy, _extra.CAPTIVATE);


}, _extra.CAPTIVATE);