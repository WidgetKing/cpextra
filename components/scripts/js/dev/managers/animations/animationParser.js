/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/10/18
 * Time: 9:28 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("animationParser", ["animationManager", "generalDataManager"], function () {

    "use strict";

    // This is a marker used to tell us when we have got to the end of a parameter's properties
    // Sure, it doesn't look great, but you work with what you've got when all you can store is numbers.
    var END_SIGNAL = 999999;

    function init () {

        _extra.animationManager.END_SIGNAL = END_SIGNAL;

        _extra.animationManager.getValidEffect =  function (animationName) {

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

        };



        _extra.animationManager.parseAnimation = function (name) {

            var index = 0;

            while (index !== null) {
                // parseEffectFrom will either return nothing
                // OR it will return the last index
                index = parseEffectFrom(name, index);
            }
        };
/*
        _extra.animationManager.cpMate = {

            "END_SIGNAL": END_SIGNAL,

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

        };*/

    }

    function parseEffectFrom (name, startIndex) {

        var effect,
            data;

        function init () {

            effect = _extra.animationManager.getValidEffect(name);

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

            // Create and register with timekeeper so we can notify the effect manager
            // of when it has entered and exited the timeline
            var instance = _extra.animationManager.effectTypes.createEffectManager(name, data);
            _extra.animationManager.registerEffectWithTimeKeeper(instance);

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

                if (value === END_SIGNAL) {
                    _extra.error("EE001");
                    return;
                } else {
                    parameters.push(value);
                }

            }

            // frame[i] should now be the index AFTER the final parameter
            // We expect this to be the same value as END_SIGNAL to confirm the end of the effect
            // If it is not, then the effect has been set up incorrectly
            // Or another alpha effect is overlapping this one on the timeline.
            if (!effect.frames[i] || effect.frames[i].value !== END_SIGNAL) {
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