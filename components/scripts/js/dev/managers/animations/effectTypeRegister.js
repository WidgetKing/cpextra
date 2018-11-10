/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/10/18
 * Time: 11:11 AM
 * To change this template use File | Settings | File Templates.
 */
_extra.registerModule("effectTypeRegister", ["animationManager"], function () {

    "use strict";

    var effectTypes = {};

    _extra.animationManager.effectTypes = {

        "parseTypes":{
            "NUMBER": "number",
            "STRING": "string"
        },

        "registerEffectType":function (data) {
            if (!data.type) {
                _extra.error("No type was defined when trying to register effect type");
                return;
            }

            if (!data.class) {
                _extra.error("No class was defined for effect type: " + data.type);
                return;
            }

            if (!data.parameters || !data.parameters.hasOwnProperty("length")) {
                _extra.error("No array of parameters details were defined for effect type: " + data.type);
                return;
            }

            effectTypes[data.type] = data;
        },

        "getEffectType": function (type) {
            return effectTypes[type];
        },






        "createEffectManager": function (name, data) {

            var type = data.type,
                parameters = data.parameters;

            function init () {

                if (!effectTypes.hasOwnProperty(type)) {
                    _extra.error("Tried to instantiate effect class of unknown type: " + type);
                    return null;
                }

                if (!parseParameters(effectTypes[type].parameters)) {
                    return;
                }

                return createInstance();

            }


            function parseParameters (parametersParseData) {

                var parseData;

                if (!parameters) {
                    parameters = [];
                    return true;
                }

                if (parametersParseData.length !== parameters.length) {
                    _extra.error("When trying to create a new effect type " + type +", we discovered " +
                        "the number of parameters defined in the effect meta-data and the amount of parameters " +
                        "sent in to the constructor did not match. We therefore abandoned object creation");

                    return false;
                }

                for (var i = 0; i < parametersParseData.length; i += 1) {

                    parseData = parametersParseData[i];

                    switch (parseData.type) {

                        case _extra.animationManager.effectTypes.parseTypes.NUMBER:
                            parameters[i] = parseNumber(parseData, parameters[i]);
                            break;

                        case _extra.animationManager.effectTypes.parseTypes.STRING:
                            parameters[i] = parseString(parseData, parameters[i]);
                            break;

                        default :
                            _extra.error("Try to parse parameter of unknown type: " + parseData.type);
                            return false;

                    }

                }

                return true;

            }

            function parseNumber (parseData, value) {

                value = _extra.w.parseInt(value);

                if (parseData.subtract) {

                    /*
                     * Example:
                     * 101 will become 1
                     */

                    return value - parseData.subtract;
                }

            }

            function parseString (parseData, value) {

                /*
                 * Example
                 * 101 will become "Enter"
                 * 102 will become "Exit"
                 */

                if (parseData.replace.hasOwnProperty(value)) {
                    return parseData.replace[value];
                }

            }

            function createInstance () {

                var instance = instantiateClassWithMultipropertyConstructor(effectTypes[type].class, parameters);

                formatInstance(instance);

                _extra.animationManager.registerWithEffectTimeKeeper(instance);

                return instance;

            }

            function instantiateClassWithMultipropertyConstructor (TheClass, args) {

                function F(args) {
                    return TheClass.apply(this, args);
                }

                F.prototype = TheClass.prototype;

                return new F(args);
            }

            function formatInstance (instance) {
                instance.startFrame = data.effect.frames[data.startFrame].frame;
                instance.endFrame = data.effect.frames[data.endFrame].frame;
            }


            return init();

        }

    };

});