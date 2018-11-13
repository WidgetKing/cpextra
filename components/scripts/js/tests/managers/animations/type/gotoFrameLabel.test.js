/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/13/18
 * Time: 9:22 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for gotoFrameLabel animation type", function () {

    "use strict";

    var module = unitTests.getModule("gotoFrameLabel"),
        effectTypeData,
        createEffect;

    beforeEach(function () {

        createEffect = function (frameLabel, enterOrExit) {
            var effect = new effectTypeData.class(frameLabel, enterOrExit);
            effect.slideObjectName = "slideObjectName";
            return effect;
        };

        window._extra = {
            "classes":unitTests.classes,
            "animationManager":{
                "effectTypes":{
                    "registerEffectType": function (data) {
                        effectTypeData = data;
                    }
                }
            },
            "cpMate":{
                "broadcastTo":jasmine.createSpy("cpMate.broadcastTo()")
            }
        };

        spyOn(_extra.animationManager.effectTypes, "registerEffectType").and.callThrough();

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should register with effect types", function () {
        expect(_extra.animationManager.effectTypes.registerEffectType).toHaveBeenCalled();
    });

    it("should broadcast to CpMate when to change the frame number", function () {

        var effect = createEffect(2, "enter");
        effect.enter();

        expect(_extra.cpMate.broadcastTo).toHaveBeenCalledWith("slideObjectName", {
            "action":"gotoFrameLabel",
            "parameters":[2]
        });

    });

    it("should broadcast on the exit action if that is how it is setup", function () {

        var effect = createEffect(2, "exit");

        effect.enter();
        expect(_extra.cpMate.broadcastTo).not.toHaveBeenCalled();

        effect.exit();
        expect(_extra.cpMate.broadcastTo).toHaveBeenCalled();


    });
});