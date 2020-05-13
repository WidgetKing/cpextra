/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/10/18
 * Time: 11:12 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.animationManager.effectTypes", function () {

    "use strict";

    var module = unitTests.getModule("effectTypeFactory"),
        timekeeper = unitTests.getModule("timekeeper");

    function createEffectData (data) {
        if (!data.type) {
            data.type = 101;
        }
        if (!data.parameters) {
            data.parameters = [101];
        }
        if (!data.effect) {
            data.effect = {};
        }
        if (!data.effect.frames) {
            data.effect.frames = [
                {
                    "frame":30
                },
                {
                    "frame":45
                },
                {
                    "frame":60
                }
            ];
        }
        if (!data.startIndex) {
            data.startIndex = 0;
        }
        if (!data.endIndex) {
            data.endIndex = 2;
        }
        if (!data.enter) {
            data.enter = function () {

            };
        }
        if (!data.exit) {
            data.exit = function () {

            };
        }

        return data;
    }

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "animationManager": {

            },
            "error": jasmine.createSpy("_extra.error"),
            "w":window
        };

        module();
        timekeeper();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.animationManager.effectTypes", function () {
        expect(_extra.animationManager.effectTypes).toBeDefined();
    });

    it("should allow us to register an effect type", function () {

        // ---- Test 1

        var type = {
            "type":101,
            "class": function () {

                this.enter = function () {

                };

                this.exit = function () {

                };

            },
            "parameters":[]
        };

        _extra.animationManager.effectTypes.registerEffectType(type);

        expect(_extra.animationManager.effectTypes.getEffectType(101)).toEqual(type);

        // ---- Test 2 (error: no constructor)
        type = {
            "type":102,
            "parameters":[]
        };

        _extra.animationManager.effectTypes.registerEffectType(type);
        expect(_extra.error).toHaveBeenCalled();

        // Setup
        _extra.error.calls.reset();

        // ---- Test 3 (error: no parameters)
        type = {
            "type":102,
            "class": function () {

            }
        };

        _extra.animationManager.effectTypes.registerEffectType(type);
        expect(_extra.error).toHaveBeenCalled();

        // ---- Test 4 (error: type number too low
        type = {
            "type":100,
            "class": function () {

            },
            "parameters":[]
        };

    });

    it("should assist us in instantiating an effect", function () {

        // ---- Setup
        var called = false;

        function MyEffectClass() {
            called = true;

            this.enter = function () {

            };

            this.exit = function () {

            };
        }

        _extra.animationManager.effectTypes.registerEffectType({
            "type":101,
            "class": MyEffectClass,
            "parameters":[]
        });

        // ---- Test 1

        var instance = _extra.animationManager.effectTypes.createEffectManager("name", createEffectData({
            "type":101,
            "parameters":[]
        }));

        expect(instance.constructor).toEqual(MyEffectClass);
        expect(called).toBe(true);

        // ---- Test 2 (an error)
        _extra.animationManager.effectTypes.createEffectManager("name", createEffectData({
            "type":102
        }));
        expect(_extra.error).toHaveBeenCalled();

    });

    it("should subtract a number from the parameters if we define so", function () {

        // ---- Setup
        var sentParameter,
            called = false,
            effect,
            EffectClass = function (par) {
                called = true;
                sentParameter = par;

                this.enter = function () {

                };

                this.exit = function () {

                };
            };

        _extra.animationManager.effectTypes.registerEffectType({
            "type":101,
            "class": EffectClass,
            "parameters":[
                {
                    "type":"number",
                    "subtract": 100
                }
            ]
        });

        // ---- Test 1
        effect = _extra.animationManager.effectTypes.createEffectManager("name", createEffectData({
            "type": 101,
            "parameters": [101]
        }));

        expect(called).toBe(true);
        expect(sentParameter).toBe(1);
        expect(effect.constructor).toBe(EffectClass);

        // ---- Test 2 (Error: Parameters not of same number)
        _extra.animationManager.effectTypes.createEffectManager("name", createEffectData({
            "type": 101,
            "parameters": [101, 999999]
        }));

        expect(_extra.error).toHaveBeenCalled();

    });

    it("should swap numbers with strings if we define so", function () {

        var parameter1,
            parameter2,
            EffectClass = function (par1, par2) {
                parameter1 = par1;
                parameter2 = par2;

                this.enter = function () {

                };

                this.exit = function () {

                };
            };

        _extra.animationManager.effectTypes.registerEffectType({
            "type":101,
            "class": EffectClass,
            "parameters":[
                {
                    "type":"string",
                    replace:{
                        "101":"foo",
                        "102":"bar"
                    }
                },
                {
                    "type":"string",
                    "replace": {
                        101:"foo",
                        102:"bar"
                    }
                }
            ]
        });

        _extra.animationManager.effectTypes.createEffectManager("name", createEffectData({
            "type": 101,
            "parameters":  [101, 102]
        }));

        expect(parameter1).toBe("foo");
        expect(parameter2).toBe("bar");

    });

    it("should format the instance to fulfill the timekeeper interface", function () {

        var parameter1;

        // ---- Setup
        _extra.animationManager.effectTypes.registerEffectType({
            "type":101,
            "class": function (par1) {
                parameter1 = par1;

                this.enter = function () {

                };

                this.exit = function () {

                };
            },
            "parameters":[
                {
                    "type":"string",
                    replace:{
                        "101":"foo",
                        "102":"bar"
                    }
                }
            ]
        });

        // ---- Test 1

        var instance = _extra.animationManager.effectTypes.createEffectManager("name", createEffectData({
            "effect":{
                "slideNumber":1,
                "slideObjectName":"slideObjectName",
                "frames":[
                    {
                        "frame":30
                    },
                    {
                        "frame":45
                    },
                    {
                        "frame":60
                    }
                ]
            },
            "startIndex":0,
            "endIndex":2
        }));

        expect(instance.startFrame).toEqual(30);
        expect(instance.endFrame).toEqual(60);
        expect(instance.slideObjectName).toBe("slideObjectName");

        expect(parameter1).toBe("foo");

        expect(_extra.error).not.toHaveBeenCalled();
        expect(_extra.timekeeper.conformsToInterface(instance)).toBe(true);

    });


});