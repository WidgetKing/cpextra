/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 11/10/18
 * Time: 8:53 AM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.animationManager", function () {

    "use strict";

    var module = unitTests.getModule("animationManager", unitTests.CAPTIVATE),
        dataTypes = unitTests.getModule("globalSlideObjectTypes");

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "slideObjects":{
                "enteredSlideChildObjectsCallbacks": new unitTests.classes.Callback()
            },
            "timekeeper":{
                "addWatch":jasmine.createSpy(),
                "removeWatch":jasmine.createSpy()
            },
            "slideManager":{
                "currentSlideNumber":0,
                "enterSlideCallback": new unitTests.classes.Callback()
            }
        };

        dataTypes();
        module();


    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define _extra.animationManager", function () {
        expect(_extra.animationManager).toBeDefined();
    });

    it("should send animation on to _extra.animationManager.parseAnimation", function () {

        _extra.animationManager.parseAnimation = jasmine.createSpy();

        _extra.slideObjects.enteredSlideChildObjectsCallbacks
              .sendToCallback(_extra.dataTypes.slideObjects.WEB_OBJECT, "foobar");

        expect(_extra.animationManager.parseAnimation).toHaveBeenCalledWith("foobar");

    });

    it("should unload watchers when moving to another slide", function () {

        // ---- Part 1 (add watch)
        var effectManager = {};
        _extra.slideManager.currentSlideNumber = 1;
        _extra.animationManager.registerEffectWithTimeKeeper(effectManager);
        expect(_extra.timekeeper.addWatch).toHaveBeenCalledWith(effectManager);

        // ---- Part 2 (remove watch when entering new slide)
        _extra.slideManager.currentSlideNumber = 2;
        _extra.slideManager.enterSlideCallback.sendToCallback("*", "0.2");

        expect(_extra.timekeeper.removeWatch).toHaveBeenCalledWith(effectManager);

    });
});