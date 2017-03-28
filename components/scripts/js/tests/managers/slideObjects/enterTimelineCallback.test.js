/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 18/09/16
 * Time: 8:09 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for _extra.slideObjects.enterTimelineCallback", function () {

    "use strict";

    var module = unitTests.getModule("enterTimelineCallback"),
        hookModule = unitTests.getModule("hookManager"),
        enterTimeline;

    beforeEach(function () {

        var slideObjects = {};

        function hasSlideObject(n) {
            return slideObjects.hasOwnProperty(n)
        }

        enterTimeline = function(slideObjectName) {
            if (hasSlideObject(slideObjectName)) {
                slideObjects[slideObjectName].dispatchEvent({
                    "type":"enter"
                });
            }
        };

        window._extra = {
            "classes":unitTests.classes,
            "slideObjects": {
                "getSlideObjectByName": function (slideObjectName) {
                    if (!hasSlideObject(slideObjectName)) {
                        slideObjects[slideObjectName] = new unitTests.classes.EventDispatcher();
                        slideObjects[slideObjectName].name = slideObjectName;
                    }
                    return slideObjects[slideObjectName];
                }
            },
            "eventManager":{
                "events":{
                    "ENTER":"enter"
                }
            },
            "w":{
                "Object":window.Object
            },
            "log":function () {

            }
        };

        hookModule();
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should define enterTimelineCallback", function () {
        expect(_extra.slideObjects.enterTimelineCallback).toBeDefined();
    });

    it("should send us a callback when slide object enters timeline", function () {

        var spy = jasmine.createSpy("spy");

        _extra.slideObjects.enterTimelineCallback.addCallback("foobar", spy);

        enterTimeline("foobar");

        expect(spy).toHaveBeenCalled();

    });

    it("should remove event listener when no more handlers are added", function () {

        var spy1 = jasmine.createSpy("spy1");
        var spy2 = jasmine.createSpy("spy2");

        var slideObject = _extra.slideObjects.getSlideObjectByName("foobar");
        spyOn(slideObject,"removeEventListener");
        spyOn(slideObject,"addEventListener");

        _extra.slideObjects.enterTimelineCallback.addCallback("foobar", spy1);
        expect(slideObject.removeEventListener).not.toHaveBeenCalled();
        expect(slideObject.addEventListener).toHaveBeenCalled();
        slideObject.addEventListener.calls.reset();

        _extra.slideObjects.enterTimelineCallback.addCallback("foobar", spy2);
        expect(slideObject.addEventListener).not.toHaveBeenCalled();

        _extra.slideObjects.enterTimelineCallback.removeCallback("foobar", spy1);
        expect(slideObject.removeEventListener).not.toHaveBeenCalled();

        _extra.slideObjects.enterTimelineCallback.removeCallback("foobar", spy2);
        expect(slideObject.removeEventListener).toHaveBeenCalled();

    });
});