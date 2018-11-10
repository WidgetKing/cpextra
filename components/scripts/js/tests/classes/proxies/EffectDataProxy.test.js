/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/5/18
 * Time: 4:44 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for classes/proxies.EffectDataProxy", function () {

    "use strict";

    var slideData,
        effect;

    function createBasicEffect (data, name, index) {

        if (!name) {
            name = "name";
        }

        if (!index) {
            index = 0;
        }

        return new unitTests.classes.EffectDataProxy(data,
               name,
               index,
               slideData);
    }

    beforeEach(function () {

        slideData = {
            "animationList":[

            ]
        };

        window._extra = {
            "classes":unitTests.classes,
            "captivate":{
                "FPS":30
            },
            "w": window
        };

    });

    afterEach(function () {
        delete window._extra;
    });

    it("should accurately pick up its name", function () {

        effect = createBasicEffect({}, "foobar");

        expect(effect.name).toBe("foobar");

    });

    it("should identify its slide object", function () {

        effect = createBasicEffect({
            "a3":"slideObject"
        });

        expect(effect.slideObjectName).toBe("slideObject");

    });

    it("should identify the animation property", function () {

        // ---- Test 1

        effect = createBasicEffect({
            "a3":"slideObject"
        }, "slideObjectalphaMultiplier");

        expect(effect.animationProperty).toBe("alphaMultiplier");

        // ---- Test 2 (With suffix "_1")

        effect = createBasicEffect({
            "a3":"slideObject"
        }, "slideObjectalphaMultiplier_1");

        expect(effect.animationProperty).toBe("alphaMultiplier");
    });

    it("should get the start millisecond and frame", function () {

        slideData.animationList = [
            [1033, "effectName"] // There is always 33 miliseconds added to the start of a slide for some reason.
        ];

        effect = createBasicEffect({}, "effectName", 0);
        expect(effect.startMillisecond).toBe(1033);
        expect(effect.startFrame).toBe(30);

    });

    it("should get millisecond duration", function () {


        effect = createBasicEffect({
            "a6":300
        });

        expect(effect.duration).toBe(300);

    });

    it("should get the end millisecond and frame", function () {

        slideData.animationList = [
            [1033, "effectName"] // There is always 33 miliseconds added to the start of a slide for some reason.
        ];

        effect = createBasicEffect({
            "a6":1000
        }, "effectName", 0);

        expect(effect.endMillisecond).toBe(2033);
        expect(effect.endFrame).toBe(60);

    });

    it("should create the effects.frames object", function () {

        slideData.animationList = [
            [33, "effectName"] // There is always 33 miliseconds added to the start of a slide for some reason.
        ];

        effect = createBasicEffect({
            "b6": [
                0,
                101,

                11,
                1099,

                100,
                102
            ]
        }, "effectName", 0);

        expect(effect.frames).toEqual(jasmine.objectContaining(
            [
                {
                    "value":101,
                    "percentage":0,
                    "millisecond":NaN,
                    "frame":NaN
                },
                {
                    "value":1099,
                    "percentage":0.11,
                    "millisecond":NaN,
                    "frame":NaN
                },
                {
                    "value":102,
                    "percentage":1,
                    "millisecond":NaN,
                    "frame":NaN
                }
            ]
        ));

    });

    it("should add frame numbers to frame data", function () {

        slideData.animationList = [
            [1033, "effectName"] // There is always 33 miliseconds added to the start of a slide for some reason.
        ];

        effect = createBasicEffect({
            "a6":1000,
            "b6":[
                0,
                1,

                50,
                2,

                100,
                3
            ]
        }, "effectName", 0);

        expect(effect.frames[0].frame).toBe(30);
        expect(effect.frames[1].frame).toBe(45);
        expect(effect.frames[2].frame).toBe(60);


    });


});