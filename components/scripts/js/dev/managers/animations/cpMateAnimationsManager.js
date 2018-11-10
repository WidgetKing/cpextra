/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/10/18
 * Time: 9:28 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("cpMateAnimationManager", ["animationManager", "generalDataManager"], function () {

    "use strict";

    // This is a marker used to tell us when we have got to the end of a parameter's properties
    // Sure, it doesn't look great, but you work with what you've got when all you can store is numbers.
    var NINE_NINES = 999999999;

    function init () {
        defineCpMateAnimationManagerObject();
    }

    function defineCpMateAnimationManagerObject () {

        _extra.animationManager.cpMate = {

            "getCpMateEffect": function (animationName) {

                var data;

                function init () {

                    data = _extra.dataManager.getSlideObjectDataByName(animationName);

                    if (!data.effects || data.effects.length === 0) {
                        return null;
                    }

                    for (var i = 0; i < data.effects.length; i += 1) {

                        if (isValidEffect(data.effects[i])) {
                            return data.effects[i];
                        }

                    }

                    return null;

                }

                function isValidEffect (effect) {

                    if (effect.animationProperty !== _extra.dataTypes.effects.ALPHA) {
                        return false;
                    }

                    for (var i = 0; i < effect.frames.length; i += 1) {

                        if (effect.frames[i].value > 100) {
                            return true;
                        }

                    }

                    return null;

                }


                return init();

            },



            "parseAnimation": function (name) {

                var index = 0;

                while (index !== null) {
                    // parseEffectFrom will either return nothing
                    // OR it will return the last index
                    index = parseEffectFrom(name, index);
                }
            }

        };

    }

    function parseEffectFrom (name, startIndex) {

        var effect,
            data;

        function init () {

            effect = _extra.animationManager.cpMate.getCpMateEffect(name);

            if (!effect) {
                return null;
            }

            getEffectTypeData();

            if (!data) {
                return null;
            }

            parseParameters();

            if (!data.parameters){
                return null;
            }

            _extra.animationManager.effectTypes.createEffectManager(name, data);
            return data.endIndex + 1;
        }




        function getEffectTypeData () {

            var currentFrame;

            data = {};
            data.effect = effect;

            for (var i = startIndex; i < effect.frames.length; i += 1) {

                currentFrame = effect.frames[i];

                // We take a value of over 100 as indicating extra data for CpMate
                // Because anything between 0 and 100 will influence the alpha of the slide object.
                if (currentFrame.value > 100) {

                    data.type = currentFrame.value;
                    data.startIndex = i;
                    return;

                }
            }
        }




        function parseParameters () {

            var dataTypeData = _extra.animationManager.effectTypes.getEffectType(data.type),
                value,
                parameters = [];

            if (!dataTypeData) {
                return;
            }

            data.numParameters = dataTypeData.parameters.length;
            data.endIndex = data.startIndex + data.numParameters + 1;

            for (var i = data.startIndex + 1; i < data.endIndex; i += 1) {

                value = effect.frames[i].value;

                if (value === NINE_NINES) {
                    _extra.error("EE001");
                    return;
                } else {
                    parameters.push(value);
                }

            }

            // frame[i] should now be the index AFTER the final parameter
            // We expect this to be 999999999 to confirm the end of the effect
            // If it is not, then the effect has been set up incorrectly
            // Or another alpha effect is overlapping this one on the timeline.
            if (effect.frames[i].value !== NINE_NINES) {
                // Invalidate
                _extra.error("EE001");
                return;
            }

            // If this assignment is not made, then the effect manager is not created
            data.parameters = parameters;

        }

        return init();

    }

    init();

});