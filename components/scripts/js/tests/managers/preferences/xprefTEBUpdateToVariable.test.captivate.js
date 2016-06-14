/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 14/12/15
 * Time: 2:34 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for xprefTEBUpdateToVariable", function () {

    "use strict";

    var module = unitTests.getModule("xprefTEBUpdateToVariable", unitTests.CAPTIVATE),
        info;

    beforeEach(function () { // _extra.dataTypes.slideObjects.TEXT_ENTRY_BOX

        var slideObjects = {
            "slideObject":{
                "updateToVariable":false
            },
            "newSlideObject":{
                "updateToVariable":false
            }
        };

        window._extra = {
            "classes":unitTests.classes,
            "slideManager": {
                "currentSceneNumber": 0,
                "currentSlideNumber": 1,
                "enterSlideCallback": new unitTests.classes.Callback()
            },
            "dataTypes": {
                "slideObjects": {
                    "TEXT_ENTRY_BOX":"TEB"
                }
            },
            "preferenceManager": {
                "registerPreferenceModule": function (behaviourSuffix, behaviourInfo) {
                    info = behaviourInfo;
                    info.enabled = true;
                    return true;
                }
            },
            "slideObjects":{
                "enteredSlideChildObjectsCallbacks": new unitTests.classes.Callback(),
                "getSlideObjectByName": function(name) {
                    return slideObjects[name];
                }
            }
        };

        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should when enabled, tell the TextEntryBox slide object to update to its variable", function () {

        var slideObject = _extra.slideObjects.getSlideObjectByName("slideObject");
        info.enable();
        _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX, "slideObject");
        expect(slideObject.updateToVariable).toBe(true);

    });

    it("should, when disabled, tell all TextEntryBoxes on the slide to disable their variables", function () {

        var slideObject = _extra.slideObjects.getSlideObjectByName("slideObject");
        info.enable();
        _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX, "slideObject");
        info.disable();
        expect(slideObject.updateToVariable).toBe(false);

    });

    it("should unload information of all the TEBs when moving to another slide", function () {

        var slideObject = _extra.slideObjects.getSlideObjectByName("slideObject");
        info.enable();
        _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX, "slideObject");
        _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX, "newSlideObject");
        expect(slideObject.updateToVariable).toBe(true);

        _extra.slideManager.currentSlideNumber = 0;
        _extra.slideManager.currentSceneNumber = 1;
        _extra.slideObjects.enteredSlideChildObjectsCallbacks.sendToCallback(_extra.dataTypes.slideObjects.TEXT_ENTRY_BOX, "newSlideObject");
        expect(slideObject.updateToVariable).toBe(false);

        // Testing new slide being discovered through the enterSlideCallback
        slideObject = _extra.slideObjects.getSlideObjectByName("newSlideObject");
        expect(slideObject.updateToVariable).toBe(true);

        _extra.slideManager.currentSceneNumber = 1;
        _extra.slideManager.currentSlideNumber = 1;
        _extra.slideManager.enterSlideCallback.sendToCallback("*");
        expect(slideObject.updateToVariable).toBe(false);


    });
});