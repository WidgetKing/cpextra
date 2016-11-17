/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 18/09/16
 * Time: 8:09 PM
 * To change this template use File | Settings | File Templates.
 */
fdescribe("A test suite for _extra.slideObjects.enterTimelineCallback", function () {

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
                    }
                }
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
});