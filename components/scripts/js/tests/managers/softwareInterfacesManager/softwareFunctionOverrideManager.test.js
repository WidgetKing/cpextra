/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 1/09/16
 * Time: 1:31 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for softwareFunctionOverrideManager", function () {

    "use strict";

    var hookManager = unitTests.getModule("hookManager"),
        module = unitTests.getModule("softwareFunctionOverrideManager", unitTests.CAPTIVATE);

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes,
            "captivate":{
                "movie":{
                    "_onEnterFrame":function () {

                    }
                }
            },
            "eventManager":{
                "eventDispatcher": new unitTests.classes.EventDispatcher()
            },
            "createEvent":function (name) {
                return {
                    type:name
                };
            }
        };

        hookManager();
        module();
    });

    afterEach(function () {
        delete window._extra;
    });

    it("should allow us to execute a function on the next frame", function () {

        var spy = jasmine.createSpy("spy");
        _extra.executeOnNextFrame(spy);

        // Should be called on next frame
        _extra.captivate.movie._onEnterFrame();
        expect(spy).toHaveBeenCalled();
        spy.calls.reset();

        // Shouldn't be called on frame after that
        _extra.captivate.movie._onEnterFrame();
        expect(spy).not.toHaveBeenCalled();

    });
});