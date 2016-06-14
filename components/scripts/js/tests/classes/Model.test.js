/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 29/10/15
 * Time: 2:32 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A test suite for testing _extra.slideObjects.model", function () {

    "use strict";

    var model;

    beforeEach(function () {
        window._extra = {
            "classes":unitTests.classes
        };

        model = new unitTests.classes.Model();
    });

    afterEach(function() {
        delete window._extra;
    });

    it("should allow us to write to and access model data", function () {
        model.write("slide_object_name","property",true);
        expect(model.retrieve("slide_object_name")).toEqual({
            "property":true
        });
        expect(model.retrieve("slide_object_name", "property")).toEqual(true);
        expect(model.retrieve("not_a_slideObject", "property")).toEqual(undefined);
    });

    it("should allow us to know if data exists for a certain slide object", function () {
        model.write("foo", "property", true);
        expect(model.hasDataFor("foo")).toBe(true);
        expect(model.hasDataFor("bar")).toBe(false);
    });

    it("should notify callbacks when new data has been written to the model", function () {
        var spy1 = jasmine.createSpy("si_callback");
        var spy2 = jasmine.createSpy("*_callback");
        model.updateCallback.addCallback("s1",spy1);
        model.updateCallback.addCallback("*",spy2);
        model.write("s1","p",true);
        model.write("s2","p",false);

        var s1Result = {
            "slideObjectName":"s1",
            "property":"p",
            "previousValue":undefined,
            "currentValue":true
        };

        var s2Result = {
            "slideObjectName":"s2",
            "property":"p",
            "previousValue":undefined,
            "currentValue":false
        };

        expect(spy1).toHaveBeenCalledWith(s1Result);
        expect(spy2.calls.argsFor(0)).toEqual([s1Result]);
        expect(spy2.calls.argsFor(1)).toEqual([s2Result]);

    });

    it("shouldn't notify us when a property on the model was updated with the same value as it already equals", function () {

        model.write("s1","p",true);

        var spy = jasmine.createSpy("callback");
        model.updateCallback.addCallback("s1",spy);

        model.write("s1","p",true);
        expect(spy).not.toHaveBeenCalled();
    });

    it("should allow us to send out notifications for all parameters on a certain object", function () {
        model.write("s1","p1",true);
        model.write("s1","p2",true);

        var spy = jasmine.createSpy("p1spy");
        model.updateCallback.addCallback("s1",spy);

        model.update("s1");

        var p1Result = {
            "slideObjectName":"s1",
            "property":"p1",
            "previousValue":true,
            "currentValue":true
        };
        var p2Result = {
            "slideObjectName":"s1",
            "property":"p2",
            "previousValue":true,
            "currentValue":true
        };

        expect(spy.calls.argsFor(0)).toEqual([p1Result]);
        expect(spy.calls.argsFor(1)).toEqual([p2Result]);
    });

    it("should allow us to update all callbacks for a particular property", function () {

        model.write("s1","p",true);
        model.write("s2","p",true);
        model.write("s3","not",true);

        var spy1 = jasmine.createSpy("spy1"),
            spy2 = jasmine.createSpy("spy2"),
            spy3 = jasmine.createSpy("spy3");

        model.updateCallback.addCallback("s1",spy1);
        model.updateCallback.addCallback("s2",spy2);
        model.updateCallback.addCallback("s3",spy3);

        model.refresh("p");
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();
        expect(spy3).not.toHaveBeenCalled();

    });
});