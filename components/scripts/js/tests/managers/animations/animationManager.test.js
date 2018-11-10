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

    it("should send animation on to _extra.animationManager.parseCpMateEffects if valid", function () {

        _extra.animationManager.cpMate = {
            "parseAnimation": jasmine.createSpy()
        };

        _extra.slideObjects.enteredSlideChildObjectsCallbacks
              .sendToCallback(_extra.dataTypes.slideObjects.WEB_OBJECT, "foobar");

        expect(_extra.animationManager.cpMate.parseAnimation).toHaveBeenCalledWith("foobar");

    });
});