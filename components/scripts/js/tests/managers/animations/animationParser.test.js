/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/10/18
 * Time: 9:32 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.animationManager animation parser", function () {

    "use strict";

    var module = unitTests.getModule("animationParser"),
        dataTypes = unitTests.getModule("globalSlideObjectTypes"),
        slideObjectData,
        effectTypes,
        END_SIGNAL;

    function createEffect (name, frames) {
        slideObjectData[name] = {
            "effects": [
                {
                    "animationProperty":"alphaMultiplier",
                    "frames":frames
                }
            ]
        };
    }



    beforeEach(function () {

        slideObjectData = {};
        effectTypes = {};

        window._extra = {
            "classes":unitTests.classes,
            "animationManager": {
                "effectTypes":{
                    "createEffectManager": jasmine.createSpy("_extra.animationManager.effectTypes.createEffectManager()"),
                    "getEffectType": function (type) {
                        return effectTypes[type];
                    }
                },
                "registerEffectWithTimeKeeper":jasmine.createSpy()
            },
            "dataManager":{
                "getSlideObjectDataByName": function (name) {
                    return slideObjectData[name];
                }
            },
            "error": jasmine.createSpy("_extra.error"),
            "log": function () {

            }
        };

        dataTypes();
        module();

        END_SIGNAL = _extra.animationManager.END_SIGNAL;
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should use getValidEffect to accurately detect whether object contains effect", function () {

        // ---- Test 1
        slideObjectData.isNotAlpha = {
            "effects":[
                {
                    "animationProperty":"x",
                    "frames":[
                        {
                            "percentage":0,
                            "value":101
                        },
                        {
                            "percentage":1,
                            "value":888
                        },
                        {
                            "percentage":100,
                            "value":END_SIGNAL
                        }
                    ]
                }
            ]
        };

        expect(_extra.animationManager.getValidEffect("isNotAlpha")).toBe(null);

        // ---- Test 2
        slideObjectData.isAlphaButNotValid = {
            "effects":[
                {
                    "animationProperty":"alphaMultiplier",
                    "frames":[
                        {
                            "percentage":0,
                            "value":50
                        },
                        {
                            "percentage":100,
                            "value":100
                        }
                    ]
                }
            ]
        };

        expect(_extra.animationManager.getValidEffect("isAlphaButNotValid")).toBe(null);

        // ---- Test 3

        slideObjectData.valid = {
            "effects": [
                {
                "animationProperty":"alphaMultiplier",
                    "frames":[
                        {
                            "percentage":0,
                            "value":101
                        },
                        {
                            "percentage":1,
                            "value":888
                        },
                        {
                            "percentage":100,
                            "value":END_SIGNAL
                        }
                    ]
                }
            ]
        };
        expect(_extra.animationManager.getValidEffect("valid")).toBe(slideObjectData.valid.effects[0]);

    });


    it("should recognize effects with different manager types", function () {

        effectTypes[101] = {
            "parameters":[
                "psudo parameter"
            ]
        };

        createEffect("type101", [
            {
                "value":101
            },
            {
                "value":888
            },
            {
                "value":END_SIGNAL
            }
        ]);

        _extra.animationManager.parseAnimation("type101");

        expect(_extra.animationManager.effectTypes.createEffectManager)
              .toHaveBeenCalledWith("type101", jasmine.objectContaining({
                    "type":101
                }));

    });

    it("should extract number of parameters from data type", function () {

        effectTypes[111] = {
            "parameters":[
                "psudo parameter",
                "psudo parameter"
            ]
        };

        createEffect("type111", [
            {
                "value":111
            },
            {
                "value":222
            },
            {
                "value":333
            },
            {
                "value":END_SIGNAL
            }
        ]);

        _extra.animationManager.parseAnimation("type111");

        expect(_extra.animationManager.effectTypes.createEffectManager)
              .toHaveBeenCalledWith("type111", jasmine.objectContaining({
                "type":111,
                "parameters": [222, 333]
            }));

        expect(_extra.animationManager.registerEffectWithTimeKeeper).toHaveBeenCalled();

    });

    it("should throw errors if we haven't set the right number of parameters", function () {

        // --- Setup
        effectTypes[111] = {
            "parameters":[
                // Only one parameter
                "psudo parameter"
            ]
        };

        // ---- Test 1
        createEffect("type111", [
            {
                "value":111
            },
            {
                "value":222
            },
            // Incorrect third parameter
            {
                "value":333
            },
            {
                "value":END_SIGNAL
            }
        ]);

        _extra.animationManager.parseAnimation("type111");

        expect(_extra.error).toHaveBeenCalledWith("EE001");
        expect(_extra.animationManager.effectTypes.createEffectManager).not.toHaveBeenCalled();

        // --- Setup
        _extra.error.calls.reset();

        // ---- Test 2
        createEffect("type111", [
            {
                "value":111
            },
            // Number of parameters is correct
            // but we should never see nine nines before the end of the effect.
            {
                "value":END_SIGNAL
            },
            {
                "value":END_SIGNAL
            }
        ]);

        _extra.animationManager.parseAnimation("type111");

        expect(_extra.error).toHaveBeenCalledWith("EE001");
        expect(_extra.animationManager.effectTypes.createEffectManager).not.toHaveBeenCalled();

    });

    it("should detect multiple special effects and skip over irrelevant ones", function () {

        // --- Setup
        effectTypes[101] = {
            "parameters":[
                // Only one parameter
                "psudo parameter"
            ]
        };

        effectTypes[102] = {
            "parameters":[
                // Two parameters
                "psudo parameter",
                "psudo parameter"
            ]
        };

        // ---- Test 1
        createEffect("types101and102", [
            // Type declaration (101)
            {
                "value":101
            },
            // Single parameter
            {
                "value":222
            },
            // End
            {
                "value":END_SIGNAL
            },
            // Captivate Alpha effect
            {
                "value":50
            },
            // Type declaration (102)
            {
                "value":102
            },
            // Two parameters
            {
                "value":222
            },
            {
                "value":333
            },
            // End
            {
                "value":END_SIGNAL
            },
            // Captivate Alpha effect
            {
                "value":0
            }
        ]);

        _extra.animationManager.parseAnimation("types101and102");

        expect(_extra.error).not.toHaveBeenCalled();
        expect(_extra.animationManager.effectTypes.createEffectManager.calls.count()).toBe(2);

    });
});