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
    });



   it("should be able to add new callbacks", function() {
       cb.addCallback("foo", a.dummy);
       a.notherDummy = function () {};
       spyOn(a,"notherDummy");
       cb.addCallback("bar", a.notherDummy);

       expect(cb.hasCallbackFor("bar")).toBe(true);
       expect(cb.hasCallbackFor("foo")).toBe(true);
   });

    it("should be able to pass information to stored callbacks", function () {
        cb.addCallback("foo", a.dummy);
        cb.sendToCallback("foo", "foobar");
        expect(a.dummy).toHaveBeenCalledWith("foobar");
    });

    it("should be able to notify more than one callback", function () {
        cb.addCallback("foo", a.dummy);
        a.notherDummy = function () {};
        spyOn(a,"notherDummy");
        cb.addCallback("foo", a.notherDummy);
        cb.sendToCallback("foo", "foobar");

        expect(a.dummy).toHaveBeenCalledWith("foobar");
        expect(a.notherDummy).toHaveBeenCalledWith("foobar");
    });

    it("should be able to clear its own data", function () {
        cb.addCallback("foo", a.dummy);
        cb.clear();
        expect(cb.hasCallbackFor("foo")).toBe(false);
    });

    it("should allow us to remove a specific callback", function () {
        cb.addCallback("foo", a.dummy);
        cb.removeCallback("foo", a.dummy);
        cb.sendToCallback("foo","bar");
        expect(a.dummy).not.toHaveBeenCalled();
        expect(cb.hasCallbackFor("foo")).toBe(false);
    });

    it("should be able to use a function to loop through all the callbacks", function () {
        cb.addCallback("foo", a.dummy);
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

        cb.addCallback("foo", a.dummy);

        cb.addCallback("foo", spy1);
        expect(cb.sendToCallback("foo")).toBe("return");

        // spy2 doesn't return anything, but we don't want to get undefined as a result. We want the useful value
        cb.addCallback("foo", spy2);
        expect(cb.sendToCallback("foo")).toBe("return");

        cb.addCallback("foo", spy3);
        expect(cb.sendToCallback("foo")).toBe("new");

    });

    it("should allow us to add overwritable callbacks", function () {

        var spy1 = jasmine.createSpy("spy1"),
            spy2 = jasmine.createSpy("spy2");

        cb.addCallback("foobar", spy1, true);
        cb.addCallback("foobar", spy2, true);
        cb.sendToCallback("foobar");
        expect(spy1).not.toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();

    });

    it("should not overwrite callbacks not defined as overwritable", function () {

        var spy1 = jasmine.createSpy("spy1"),
            spy2 = jasmine.createSpy("spy2");

        cb.addCallback("foobar", spy1, false);
        cb.addCallback("foobar", spy2, true);
        cb.sendToCallback("foobar");
        expect(spy1).toHaveBeenCalled();
        expect(spy2).toHaveBeenCalled();

    });

    it("should be able to delete overwritables", function () {

        var spy1 = jasmine.createSpy("spy1");

        cb.addCallback("foobar", spy1, true);
        cb.removeCallback("foobar", spy1);
        cb.sendToCallback("foobar");
        expect(spy1).not.toHaveBeenCalled();

    });

    it("forEach should loop us through overwritable's too", function () {

        var spy1 = jasmine.createSpy("spy1"),
            spy2 = jasmine.createSpy("spy2"),
            forEachSpy = jasmine.createSpy("For Each Spy");

        cb.addCallback("foobar", spy1, false);
        cb.addCallback("foobar", spy2, true);

        cb.forEach(forEachSpy);

        expect(forEachSpy.calls.count()).toEqual(2);
        expect(forEachSpy.calls.argsFor(0)).toEqual(["foobar", spy2]);
        expect(forEachSpy.calls.argsFor(1)).toEqual(["foobar", spy1]);

    });

    it("should use addCallbackToFront() to put our callback at the start of the cue", function () {

        var spy1 = jasmine.createSpy("spy1").and.callFake(function () {
                callOrder.push("spy1");
            }),
            spy2 = jasmine.createSpy("spy2").and.callFake(function () {
                callOrder.push("spy2");
            }),
            callOrder = [];

        cb.addCallback("foobar", spy1);
        cb.addCallbackToFront("foobar", spy2);
        cb.sendToCallback("foobar", "*");

        expect(callOrder).toEqual(["spy2", "spy1"]);


    });

    it("should use removeIndex() to stop all callbacks in a certain index", function () {

        var spy1 = jasmine.createSpy("spy1"),
            spy2 = jasmine.createSpy("spy2");

        cb.addCallback("index", spy1);
        cb.addCallback("index", spy2);

        cb.removeIndex("index");

        cb.sendToCallback("index", "foobar");

        expect(spy1).not.toHaveBeenCalled();
        expect(spy2).not.toHaveBeenCalled();

        expect(cb.hasCallbackFor("index")).toBe(false);

    });

	it("should not skip over callbacks (due to other callbacks being removed)", function () {

		// 1: SETUP
		var spy1 = jasmine.createSpy("spy1").and.callFake(function () {
			cb.removeCallback("*", spy1);
		})
		var spy2 = jasmine.createSpy("spy2");
		var spy3 = jasmine.createSpy("spy3");

		// 2: TEST
		cb.addCallback("*", spy1);
		cb.addCallback("*", spy2);
		cb.addCallback("*", spy3);

		cb.sendToCallback("*", "anything");

		// 3: ASSERT
		expect(spy1).toHaveBeenCalled();
		expect(spy2).toHaveBeenCalled();
		expect(spy3).toHaveBeenCalled();

	});
});
