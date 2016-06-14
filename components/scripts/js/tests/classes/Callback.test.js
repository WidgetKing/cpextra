/**
 * Created with IntelliJ IDEA.
 * User: Tristan
 * Date: 25/09/15
 * Time: 8:37 PM
 * To change this template use File | Settings | File Templates.
 */
describe("A suite for testing the callback class", function() {
    "use strict";

    // Get access to the callback class so we can start tests.
    var cb,
        a = {};


    beforeEach(function () {
        a.dummy = function () {};
        spyOn(a,"dummy");

        cb = new unitTests.classes.Callback();
        cb.addCallback("foo", a.dummy);
    });



   it("should be able to add new callbacks", function() {
       a.notherDummy = function () {};
       spyOn(a,"notherDummy");
       cb.addCallback("bar", a.notherDummy);

       expect(cb.hasCallbackFor("bar")).toBe(true);
       expect(cb.hasCallbackFor("foo")).toBe(true);
   });

    it("should be able to pass information to stored callbacks", function () {
        cb.sendToCallback("foo", "foobar");
        expect(a.dummy).toHaveBeenCalledWith("foobar");
    });

    it("should be able to notify more than one callback", function () {
        a.notherDummy = function () {};
        spyOn(a,"notherDummy");
        cb.addCallback("foo", a.notherDummy);
        cb.sendToCallback("foo", "foobar");

        expect(a.dummy).toHaveBeenCalledWith("foobar");
        expect(a.notherDummy).toHaveBeenCalledWith("foobar");
    });

    it("should be able to clear its own data", function () {
        cb.clear();
        expect(cb.hasCallbackFor("foo")).toBe(false);
    });

    it("should allow us to remove a specific callback", function () {
        cb.removeCallback("foo", a.dummy);
        cb.sendToCallback("foo","bar");
        expect(a.dummy).not.toHaveBeenCalled();
        expect(cb.hasCallbackFor("foo")).toBe(false);
    });

    it("should be able to use a function to loop through all the callbacks", function () {
        var anotherDummy = jasmine.createSpy("anotherDummy");
        var spy = jasmine.createSpy("spy");
        cb.addCallback("foo", anotherDummy);
        cb.forEach(spy);

        expect(spy.calls.count()).toEqual(2);
        expect(spy.calls.argsFor(0)).toEqual(["foo", a.dummy]);
        expect(spy.calls.argsFor(1)).toEqual(["foo", anotherDummy]);
    });

    it("should be able to return the last value", function () {

        var spy1 = jasmine.createSpy("spy1").and.returnValue("return"),
            spy2 = jasmine.createSpy("spy2"),
            spy3 = jasmine.createSpy("spy3").and.returnValue("new");

        cb.addCallback("foo", spy1);
        expect(cb.sendToCallback("foo")).toBe("return");

        // spy2 doesn't return anything, but we don't want to get undefined as a result. We want the useful value
        cb.addCallback("foo", spy2);
        expect(cb.sendToCallback("foo")).toBe("return");

        cb.addCallback("foo", spy3);
        expect(cb.sendToCallback("foo")).toBe("new");

    });
});